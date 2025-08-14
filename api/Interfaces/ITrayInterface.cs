using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
    public interface ITrayInterface
    {
        Task<List<Tray>> GetAllAsync();
        Task<Tray?> GetByIdAsync(int id);
        Task<Tray> CreateAsync(Tray tray);
        Task<Tray?> UpdateAsync(Tray tray);
        Task<Tray?> DeleteAsync(int id);
    }
}