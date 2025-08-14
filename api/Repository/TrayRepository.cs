using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class TrayRepository : ITrayInterface
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
            return await _context.Trays.ToListAsync();
        }

        public async Task<Tray?> GetByIdAsync(int id)
        {
            return await _context.Trays.FindAsync(id);
        }

        public async Task<Tray?> UpdateAsync(Tray tray)
        {
            var existingTray = await _context.Trays.FirstOrDefaultAsync(t => t.Id == tray.Id);
            if (existingTray == null) return null;

            existingTray = tray;
            await _context.SaveChangesAsync();
            return existingTray;
        }

        
    }
}