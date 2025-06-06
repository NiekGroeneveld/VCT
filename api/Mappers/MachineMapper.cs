using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using api.Dtos.MachineDtos;
using api.Dtos.ProductDtos;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using VCT.API.Models.Machines;

namespace api.Mappers
{
    
    
    public static class MachineMapper
    {
        public static MachineDTO ToMachineDTO(this MasterMachine machineModel)
        {
            return new MachineDTO
            {
                Id = machineModel.Id,
                Name = machineModel.Name,
                Type = machineModel.MachineType.ToString(),
                MachineNumber = machineModel.MachineNumber,
                ClientId = machineModel.ClientId 
            };
        }

        public static MasterMachine ToMachineFromCreateDTO(this CreateMachineRequestDTO createMachineRequestDTO, int clientId)
        {
            return new MasterMachine
            { 
                Name = createMachineRequestDTO.Name,
                MachineType = createMachineRequestDTO.ToMachineType(),
                ClientId = clientId,
                MachineNumber = 1
            };
        }
    }
}