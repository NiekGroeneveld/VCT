using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.Models;

namespace api.Interfaces
{
    public interface ITrayRepository
    {
        Task<List<Tray>> GetAllAsync();
        Task<Tray?> GetByIdAsync(int id);
    // Returns a fresh, untracked snapshot from the database (useful after raw-SQL updates)
    Task<Tray?> GetByIdFreshAsync(int id);
        Task<Tray> CreateAsync(Tray tray);
        Task<Tray?> UpdateAsync(Tray tray);
        Task<Tray?> DeleteAsync(int id);

        // Reorder a Tray's products (0-based indices). Returns false if not found or out of bounds.
        Task<bool> ReorderWithinTrayAsync(int trayId, int oldIndex, int newIndex);
        
    }
}