using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Components;
using VCT.API.Models.Enums;
using VCT.API.Models.Machines;

namespace api.Dtos.MachineDtos
{
    public class MachineDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int MachineNumber { get; set; }
        public int ClientId { get; set; }
        public required String Type { get; set; }
        
        //Nog maken
        //public Configuration? Config { get; set; }
        //public List<SatelliteMachine> SatelliteMachines { get; } = new List<SatelliteMachine>();

        public MachineType ToMachineType() => Enum.Parse<MachineType>(Type);
    }
}