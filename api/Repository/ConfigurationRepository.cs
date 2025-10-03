using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly ApplicationDBContext _context; 
        public ConfigurationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Configuration> CreateAsync(Configuration configuration)
        {
            _context.Configurations.Add(configuration);
            await _context.SaveChangesAsync();
            return configuration;

        }

        public async Task<Configuration?> DeleteAsync(int id)
        {
            var configuration = await _context.Configurations.FindAsync(id);
            if (configuration == null) return null;

            _context.Configurations.Remove(configuration);
            await _context.SaveChangesAsync();
            return configuration;
        }

        public async Task<List<Configuration>> GetAllAsync()
        {
            return await _context.Configurations
                .Include(c => c.ConfigurationTypeData)
                .Include(c => c.Company)
                .Include(c => c.Trays)
                    .ThenInclude(t => t.TrayProducts)
                        .ThenInclude(tp => tp.Product)
                .ToListAsync();
        }

        public async Task<Configuration?> GetByIdAsync(int id)
        {
            return await _context.Configurations
                .Include(c => c.ConfigurationTypeData)
                .Include(c => c.Company)
                .Include(c => c.Trays)
                    .ThenInclude(t => t.TrayProducts)
                        .ThenInclude(tp => tp.Product)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        
        //This method does not retrieve the full Config, just the name and the id for dropdowns
        public Task<List<Configuration>> GetConfigurationsNamesIdsForCompanyAsync(int companyId)
        {
            return _context.Configurations
                .Where(c => c.CompanyId == companyId)
                .ToListAsync();
        }

        public async Task<Configuration?> UpdateAsync(Configuration configuration)
        {
            var existingConfiguration = await _context.Configurations.FirstOrDefaultAsync(c => c.Id == configuration.Id);
            if (existingConfiguration == null) return null;

            existingConfiguration = configuration;
            existingConfiguration.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return existingConfiguration;
        }

        public async Task<Configuration?> UpdateElevatorSettingsAsync(int id, int elevatorSetting, string elevatorAddition)
        {
            var configuration = await GetByIdAsync(id);
            if (configuration == null) return null;

            if (configuration.ConfigurationType != "VisionV8")
            {
                throw new InvalidOperationException("Elevator settings can only be updated for VisionV8 configurations.");
                
            }

            configuration.ElevatorSetting = elevatorSetting;
            configuration.ElevatorAddition = elevatorAddition;
            configuration.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return configuration;
        }
    }
}