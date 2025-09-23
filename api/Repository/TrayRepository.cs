using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.Tray;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class TrayRepository : ITrayRepository
    {
        private readonly ApplicationDBContext _context;

        public TrayRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Tray> CreateAsync(Tray tray)
        {
            tray.CreatedAt = DateTime.UtcNow;
            _context.Trays.Add(tray);
            await _context.SaveChangesAsync();
            return tray;
        }

        public async Task<Tray?> DeleteAsync(int id)
        {
            var tray = await _context.Trays.FirstOrDefaultAsync(t => t.Id == id);
            if (tray == null) return null;

            _context.Trays.Remove(tray);
            await _context.SaveChangesAsync();
            return tray;
        }

        public async Task<List<Tray>> GetAllAsync()
        {
            return await _context.Trays.Include(t => t.TrayProducts).ThenInclude(tp => tp.Product).ToListAsync();
        }

        public async Task<Tray?> GetByIdAsync(int id)
        {
            return await _context.Trays.Include(t => t.TrayProducts).ThenInclude(tp => tp.Product).FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Tray?> GetByIdFreshAsync(int id)
        {
            return await _context.Trays
                .AsNoTracking()
                .Include(t => t.TrayProducts)
                .ThenInclude(tp => tp.Product)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Tray?> UpdateAsync(Tray tray)
        {
            // If 'tray' is already tracked (common when caller loaded it via this repository),
            // changes like added TrayProducts are tracked and only SaveChanges is needed.
            var isTracked = _context.ChangeTracker.Entries<Tray>().Any(e => e.Entity == tray);
            if (!isTracked)
            {
                // Attach and mark as modified when detached. Be careful with child collections.
                _context.Trays.Attach(tray);
                _context.Entry(tray).State = EntityState.Modified;
                // Ensure existing TrayProducts are attached/added as needed
                foreach (var tp in tray.TrayProducts)
                {
                    if (_context.Entry(tp).State == EntityState.Detached)
                    {
                        _context.Entry(tp).State = tp.Id == 0 ? EntityState.Added : EntityState.Modified;
                    }
                }
            }
            tray.UpdatedAt = DateTime.UtcNow;
            // Reorder OnTrayIndex to be sequential starting from 0 (0-based)
            tray.TrayProducts = ReorderTrayProducts(tray.TrayProducts);

            await _context.SaveChangesAsync();
            return tray;
        }

        public async Task<List<Tray>> UpdateTrayListAsync(List<Tray> trays)
        {
            foreach (var tray in trays)
            {
                await UpdateAsync(tray);
            }
            return trays;
        }

        private List<TrayProduct> ReorderTrayProducts(ICollection<TrayProduct> trayProducts)
        {
            var ordered = trayProducts.OrderBy(tp => tp.OnTrayIndex).ToList();
            for (int i = 0; i < ordered.Count; i++)
            {
                ordered[i].OnTrayIndex = i; // 0-based
            }
            return ordered;
        }

        public async Task<bool> ReorderWithinTrayAsync(int trayId, int oldIndex, int newIndex)
        {
            if (oldIndex == newIndex) return true;
            var trayExists = await _context.Trays.AnyAsync(t => t.Id == trayId);
            if (!trayExists) return false;

            using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                // Temporarily move the target row to a negative index to free its slot
                int tempIndex = -9999;
                int moved = await _context.Database.ExecuteSqlRawAsync(
                    "UPDATE `TrayProducts` SET `OnTrayIndex` = {0} WHERE `TrayId` = {1} AND `OnTrayIndex` = {2}",
                    tempIndex, trayId, oldIndex);
                if (moved == 0)
                {
                    await tx.RollbackAsync();
                    return false;
                }

                if (newIndex > oldIndex)
                {
                    // Shift left items between oldIndex+1..newIndex
                    await _context.Database.ExecuteSqlRawAsync(
                        "UPDATE `TrayProducts` SET `OnTrayIndex` = `OnTrayIndex` - 1 WHERE `TrayId` = {0} AND `OnTrayIndex` > {1} AND `OnTrayIndex` <= {2}",
                        trayId, oldIndex, newIndex);
                }
                else
                {
                    // Shift right items between newIndex..oldIndex-1
                    await _context.Database.ExecuteSqlRawAsync(
                        "UPDATE `TrayProducts` SET `OnTrayIndex` = `OnTrayIndex` + 1 WHERE `TrayId` = {0} AND `OnTrayIndex` >= {1} AND `OnTrayIndex` < {2}",
                        trayId, newIndex, oldIndex);
                }

                // Place the moved item at newIndex
                await _context.Database.ExecuteSqlRawAsync(
                    "UPDATE `TrayProducts` SET `OnTrayIndex` = {0} WHERE `TrayId` = {1} AND `OnTrayIndex` = {2}",
                    newIndex, trayId, tempIndex);

                // Normalize to 0..n-1
                var ids = await _context.TrayProducts
                    .Where(tp => tp.TrayId == trayId)
                    .OrderBy(tp => tp.OnTrayIndex)
                    .Select(tp => tp.Id)
                    .ToListAsync();
                for (int i = 0; i < ids.Count; i++)
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "UPDATE `TrayProducts` SET `OnTrayIndex` = {0} WHERE `Id` = {1}", i, ids[i]);
                }

                await tx.CommitAsync();
                return true;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
    }
}