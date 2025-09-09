using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Configuration;
using api.Models;

namespace api.Interfaces
{
    public interface IConfigurationRepository
    {
        Task<List<Configuration>> GetAllAsync();
        Task<Configuration?> GetByIdAsync(int id);
        Task<Configuration> CreateAsync(Configuration configuration);
        Task<Configuration?> UpdateAsync(Configuration configuration);
        Task<Configuration?> DeleteAsync(int id);

        Task<List<Configuration>> GetConfigurationsNamesIdsForCompanyAsync(int companyId);
    }
}