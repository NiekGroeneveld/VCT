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
    }
}