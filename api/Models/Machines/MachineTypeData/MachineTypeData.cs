using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Enums;
using VCT.API.Models.Machines;

namespace api.Models.Machines.MachineTypeData
{
    public static class MachineTypeData
    {
        public static Dictionary<MachineType, MachineTypeSpecs> MachineTypeSpecs = new Dictionary<MachineType, MachineTypeSpecs>
        {
            { MachineType.VisionV8, new MachineTypeSpecs(MachineType.VisionV8, 64, 200, 200, "VisionV8") },
            { MachineType.NUUK, new MachineTypeSpecs(MachineType.NUUK, 60, 200, 200, "NUUK") },
            { MachineType.ComboPlus, new MachineTypeSpecs(MachineType.ComboPlus, 45, 200, 200, "ComboPlus") }
        };
    }
}