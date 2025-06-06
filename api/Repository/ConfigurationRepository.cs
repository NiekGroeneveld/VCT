using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.ConfigurationDtos;
using api.Interfaces;
using api.Migrations;
using api.Models.Enums;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Components;
using VCT.API.Models.Enums;

namespace api.Repository
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly ApplicationDBContext _context;

        public ConfigurationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public Task<Tray?> AddTrayAsync(int Id)
        {
            var configuration = _context.Configurations.FindAsync(id);
            
            //Logic from the Configuration Class
            int newTrayPos = GetNewTrayPosition(conifugration);
        }

        public Task<bool> ConfigurationExists(int id)
        {
            return _context.Configurations.AnyAsync(c => c.Id == id);
        }

        public async Task<Configuration> CreateAsync(Configuration configModel)
        {
            await _context.Configurations.AddAsync(configModel);
            await _context.SaveChangesAsync();
            return configModel;
        }

        public async Task<Configuration?> DeleteAsync(int id)
        {
            var configuration = await _context.Configurations.Include(c => c.Trays).FirstOrDefaultAsync(c => c.Id == id);

            if(configuration == null)    {return null;}

            _context.Configurations.Remove(configuration); ///Not async!
            await _context.SaveChangesAsync(); 
            return configuration;
        }

        public async Task<List<Configuration>> GetAllAsync()
        {
            var configurations = await _context.Configurations.Include(c => c.Trays).ToListAsync();
            return configurations;
        }

        public Task<Configuration?> GetByIdAsync(int id)
        {
            return _context.Configurations.Include(c => c.Trays).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Configuration?> GetByMachineIdAsync(int machineId)
        {
            return await _context.Configurations.Include(c => c.Trays).FirstOrDefaultAsync(c => c.MachineId == machineId);
        }
        

        public async Task<List<Configuration>> GetByMachineTypeAsync(MachineType machineType)
        {
            ConfigurationType configType = machineType.ToConfigurationType();
            return await _context.Configurations.Include(c => c.Trays).Where(c => c.ConfigurationType == configType).ToListAsync();
        }

        public Task<Tray?> RemoveTrayAsync(int id, int trayId)
        {
            throw new NotImplementedException();
        }

        public async Task<Configuration?> UpdateAsync(int id, UpdateConfigurationRequestDTO configModel)
        {
            var existingConfiguration = await _context.Configurations.Include(c => c.Trays).FirstOrDefaultAsync(c => c.Id ==id);
            if (existingConfiguration == null)    {return null;}

            existingConfiguration.Name = configModel.Name;

            await _context.SaveChangesAsync();
            return existingConfiguration;
        }
    }
}