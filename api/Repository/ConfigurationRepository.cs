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

        public async Task<Configuration?> CloneConfigurationAsync(int id, string newName)
        {
            // Load original configuration WITHOUT tracking and WITHOUT navigation properties that we want to reference
            var original = await _context.Configurations
                    .AsNoTracking()
                    .Include(c => c.Trays)
                        .ThenInclude(t => t.TrayProducts)
                    .FirstOrDefaultAsync(c => c.Id == id);
            
            if (original == null) return null;

            // Store the IDs we need to reference existing entities
            var configTypeDataId = original.ConfigurationTypeDataId;
            var companyId = original.CompanyId;

            // Create a new configuration with copied properties
            var cloned = new Configuration
            {
                Name = newName,
                ConfigurationType = original.ConfigurationType,
                ConfigurationTypeDataId = configTypeDataId, // Reference existing ConfigurationTypeData by ID only
                ConfigurationTypeData = null!, // IMPORTANT: Set to null to prevent EF from creating a new entity
                ElevatorSetting = original.ElevatorSetting,
                ElevatorAddition = original.ElevatorAddition,
                CompanyId = companyId, // Reference existing Company by ID only
                Company = null!, // IMPORTANT: Set to null to prevent EF from creating a new entity
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Deep copy trays - create new instances
            foreach (var tray in original.Trays)
            {
                var newTray = new Tray
                {
                    TrayConfig = tray.TrayConfig,
                    TrayPosition = tray.TrayPosition,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Configuration = null! // IMPORTANT: Don't set back-reference
                };

                // Deep copy tray products - create new instances but reference existing products
                foreach (var trayProduct in tray.TrayProducts)
                {
                    newTray.TrayProducts.Add(new TrayProduct
                    {
                        ProductId = trayProduct.ProductId, // Reference existing product by ID only
                        Product = null!, // IMPORTANT: Set to null to prevent EF from creating a new entity
                        OnTrayIndex = trayProduct.OnTrayIndex,
                        CreatedAt = DateTime.UtcNow,
                        Tray = null! // IMPORTANT: Don't set back-reference
                    });
                }

                cloned.Trays.Add(newTray);
            }

            // Add to context - EF will generate new IDs for Configuration, Trays, and TrayProducts
            _context.Configurations.Add(cloned);
            await _context.SaveChangesAsync();

            // Reload the cloned configuration with all navigation properties populated
            var reloadedClone = await _context.Configurations
                .Include(c => c.Trays)
                    .ThenInclude(t => t.TrayProducts)
                        .ThenInclude(tp => tp.Product)
                .Include(c => c.ConfigurationTypeData)
                .Include(c => c.Company)
                .FirstOrDefaultAsync(c => c.Id == cloned.Id);

            return reloadedClone;
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
        public async Task<List<Configuration>> GetConfigurationsNamesIdsForCompanyAsync(int companyId)
        {
            var configs = await _context.Configurations
                .Where(c => c.CompanyId == companyId)
                .ToListAsync();
            
            Console.WriteLine($"[GetConfigurationsForCompany] CompanyId: {companyId}, Found {configs.Count} configurations");
            foreach (var config in configs)
            {
                Console.WriteLine($"  - ID: {config.Id}, Name: {config.Name}, CompanyId: {config.CompanyId}");
            }
            
            return configs;
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