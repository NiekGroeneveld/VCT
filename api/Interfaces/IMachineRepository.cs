using System;
using System.Collections.Generic;
using System.Linq;

using System.Threading.Tasks;
using api.Dtos.MachineDtos;
using VCT.API.Models.Enums;
using VCT.API.Models.Machines;

namespace api.Interfaces
{
    public interface IMachineRepository
    {
        Task<List<MasterMachine>> GetAllAsync();
        Task<MasterMachine?> GetByIdAsync(int id);
        Task<MasterMachine> CreateAsync(MasterMachine machineModel);
        Task<MasterMachine?> UpdateAsync(int id, UpdateMachineRequestDTO updateDTO);
        Task<MasterMachine?> DeleteAsync(int id);  

        //Additional Method
        Task<MachineType?> GetMachineTypeAsync(int id); 
        Task<bool> MachineExists(int id);
    }
}