using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ConfigurationDtos;
using VCT.API.Models.Components;
using VCT.API.Models.Enums;

namespace api.Interfaces
{
    public interface IConfigurationRepository
    {
       Task<List<Configuration>> GetAllAsync();
       Task<Configuration?> GetByIdAsync(int id);
       Task<Configuration> CreateAsync(Configuration configModel);
       Task<Configuration?> UpdateAsync(int id, UpdateConfigurationRequestDTO configModel);
       Task<Configuration?> DeleteAsync(int id);

       //Additional
       Task<Configuration?> GetByMachineIdAsync(int machineId);
       Task<List<Configuration>> GetByMachineTypeAsync(MachineType machineType);

    }
}