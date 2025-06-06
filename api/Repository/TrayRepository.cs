using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.TrayDtos;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Components;

namespace api.Repository
{
    public class TrayRepository : ITrayRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IConfigurationRepository _configurationRepository;

        public TrayRepository(ApplicationDBContext context, IConfigurationRepository configurationRepository)
        {
            _context = context;
            _configurationRepository = configurationRepository;
        }

        public Task<Tray> CreateByConfigIdAsync(Tray trayModel, int ConfigurationId)
        {
            throw new NotImplementedException();
        }

        public Task<Tray> CreateByMachineIdAsync(Tray trayModel, int MachineId)
        {
            throw new NotImplementedException();
        }

        public Task<Tray?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Tray>> GetAllAsync()
        {
            var tray = await _context.Trays.ToListAsync();
            return tray;
        }

        public Task<List<Tray>> GetByConfigurationIdAsync(int ConfigurationId)
        {
            throw new NotImplementedException();
        }

        public async Task<Tray?> GetByIdAsync(int id)
        {
            return await _context.Trays.Include(c => c.Canals).FirstOrDefaultAsync(c => c.Id == id);
        }

        public Task<List<Tray>> GetByMachineIdAsync(int MachineId)
        {
            throw new NotImplementedException();
        }

        public Task<Tray?> UpdateAsync(int id, UpdateTrayRequestDTO updateDTO)
        {
            throw new NotImplementedException();
        }
    }
}