using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.TrayDtos;
using VCT.API.Models.Components;

namespace api.Interfaces
{
    public interface ITrayRepository
    {
        Task<List<Tray>> GetAllAsync();
        Task<Tray?> GetByIdAsync(int id);

        Task<Tray> CreateByConfigIdAsync(Tray trayModel, int ConfigurationId);
        Task<Tray> CreateByMachineIdAsync(Tray trayModel, int MachineId);

        Task<Tray?> UpdateAsync(int id, UpdateTrayRequestDTO updateDTO);
        Task<Tray?> DeleteAsync(int id);

        //Additional
        Task<List<Tray>> GetByConfigurationIdAsync(int ConfigurationId);
        Task<List<Tray>> GetByMachineIdAsync(int MachineId);
         
    }
}