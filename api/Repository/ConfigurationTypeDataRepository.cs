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
    public class ConfigurationTypeDataRepository : IConfigurationTypeDataRepository
    {
        private readonly ApplicationDBContext _context;

        public ConfigurationTypeDataRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ConfigurationTypeData> CreateAsync(ConfigurationTypeData configurationTypeData)
        {
            await _context.ConfigurationTypeData.AddAsync(configurationTypeData);
            await _context.SaveChangesAsync();
            return configurationTypeData;
        }

        public async Task<ConfigurationTypeData?> DeleteAsync(int id)
        {
            var configurationTypeData = await _context.ConfigurationTypeData.FindAsync(id);
            if (configurationTypeData == null) return null;

            _context.ConfigurationTypeData.Remove(configurationTypeData);
            await _context.SaveChangesAsync();
            return configurationTypeData;
        }

        public async Task<List<ConfigurationTypeData>> GetAllAsync()
        {
            return await _context.ConfigurationTypeData.ToListAsync();
        }

        public async Task<ConfigurationTypeData?> GetByTypeNameAsync(string type)
        {
            return await _context.ConfigurationTypeData.FirstOrDefaultAsync(c => c.ConfigurationType == type);
        }

        public async Task<ConfigurationTypeData?> GetByIdAsync(int id)
        {
            return await _context.ConfigurationTypeData.FindAsync(id);
        }

        public async Task<ConfigurationTypeData?> UpdateAsync(ConfigurationTypeData configurationTypeData)
        {
            _context.ConfigurationTypeData.Update(configurationTypeData);
            await _context.SaveChangesAsync();
            return configurationTypeData;
        }

        public Task<List<string>> GetTypesAsync()
        {
            return _context.ConfigurationTypeData
                .Select(c => c.ConfigurationType)
                .Distinct()
                .ToListAsync();
        }
    }
}