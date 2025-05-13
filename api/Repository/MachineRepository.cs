using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.MachineDtos;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Enums;
using VCT.API.Models.Machines;

namespace api.Repository
{
    public class MachineRepository : IMachineRepository
    {
        private readonly ApplicationDBContext _context;

        public MachineRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        
        public async Task<MasterMachine> CreateAsync(MasterMachine machineModel)
        {
            await _context.MasterMachines.AddAsync(machineModel);
            await _context.SaveChangesAsync();
            return machineModel;
        }

        public async Task<MasterMachine?> DeleteAsync(int id)
        {
            var machineModel =await _context.MasterMachines.FirstOrDefaultAsync(m => m.Id == id);

            if(machineModel == null)    {return null;}

            _context.MasterMachines.Remove(machineModel); ///Not async!
            await _context.SaveChangesAsync();
            return machineModel;
        }

        public Task<List<MasterMachine>> GetAllAsync()
        {
            var MasterMachines = _context.MasterMachines.ToListAsync();
            return MasterMachines;
        }

        public async Task<MasterMachine?> GetByIdAsync(int id)
        {
           return await _context.MasterMachines.Include(s => s.SatelliteMachines).FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<MachineType?> GetMachineTypeAsync(int id)
        {
            var machine = await _context.MasterMachines.FirstOrDefaultAsync(m => m.Id == id);
            if(machine == null)    {return null;}
            
            return machine.MachineType;
        }

        public Task<bool> MachineExists(int id)
        {
            return _context.MasterMachines.AnyAsync(m => m.Id == id);
        }

        public async Task<MasterMachine?> UpdateAsync(int id, UpdateMachineRequestDTO updateDTO)
        {
            var existingMachine = _context.MasterMachines.FirstOrDefault(m => m.Id == id);

            if(existingMachine == null)    {return null;}

            existingMachine.Name = updateDTO.Name;
            existingMachine.ClientId = updateDTO.ClientId;

            await _context.SaveChangesAsync();
            return existingMachine;   
        }
    }
}