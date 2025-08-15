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
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly ApplicationDBContext _context;

        public ConfigurationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Configuration> CreateAsync(Configuration configuration)
        {
            await _context.Configurations.AddAsync(configuration);
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
            return await _context.Configurations.ToListAsync();
        }

        public async Task<Configuration?> GetByIdAsync(int id)
        {
            return await _context.Configurations.FindAsync(id);
        }

        public async Task<Configuration?> UpdateAsync(Configuration configuration)
        {
            var existingConfiguration = await _context.Configurations.FirstOrDefaultAsync(c => c.Id == configuration.Id);
            if (existingConfiguration == null) return null;

            existingConfiguration = configuration;

            await _context.SaveChangesAsync();
            return existingConfiguration;
        }
    }
}