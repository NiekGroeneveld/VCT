using VCT.API.Models.Enums;

namespace VCT.API.Models.Machines
{
    public class SatelliteMachine : Machine
    {
        internal SatelliteMachine(int machineNumber, MachineType type) {
            MachineNumber = machineNumber;
            Type = type;
            InitializeConfig();
        }
    }
}
