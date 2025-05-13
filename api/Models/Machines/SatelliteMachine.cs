using VCT.API.Models.Enums;

namespace VCT.API.Models.Machines
{
    public class SatelliteMachine : Machine
    {
        public int Id { get; set; }
        public int MasterMachineId { get; set; }
        
        public SatelliteMachine() { }
       
        internal SatelliteMachine(int machineNumber, MachineType type) {
            MachineNumber = machineNumber;
            MachineType = type;
            InitializeConfig();
        }
    }
}
