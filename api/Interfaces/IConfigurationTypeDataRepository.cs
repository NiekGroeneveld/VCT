using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
    public interface IConfigurationTypeDataRepository
    {
        public Task<List<ConfigurationTypeData>> GetAllAsync();
        public Task<ConfigurationTypeData?> GetByIdAsync(int id);
        public Task<ConfigurationTypeData> CreateAsync(ConfigurationTypeData configurationTypeData);
        public Task<ConfigurationTypeData?> UpdateAsync(ConfigurationTypeData configurationTypeData);
        public Task<ConfigurationTypeData?> DeleteAsync(int id);


        //Additional
        public Task<ConfigurationTypeData?> GetByTypeNameAsync(string type);
        public Task<List<string>> GetTypesAsync();
    }
}