using System;
using VCT.API.Models.Enums;

namespace VCT.API.Models.Machines
{
    public class MasterMachine : Machine
    {
        public List<SatelliteMachine> SatelliteMachines { get; } = new List<SatelliteMachine>();

        public MasterMachine(int machineNumber, MachineType type)
        {
            MachineNumber = machineNumber;
            Type = type;
            InitializeConfig();
        }



        public void AddSatellite(MachineType type)
        {
            SatelliteMachines.Add(new SatelliteMachine(SatelliteMachines.Count, type));
        }

        public void RemoveSatellite(int machineNumber)
        {
            //ToDo, take care of machinenumbers.
        }
    }
}
