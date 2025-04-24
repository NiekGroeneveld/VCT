using System.Collections.Generic;
using VCT.API.Models.Enums;
using VCT.API.Models.Machines;

namespace VCT.API.Models.SpecificationData
{


    public static class MachineSpecifications
    {
        public static readonly Dictionary<MachineType, MachineTypeSpecs> Specs = new Dictionary<MachineType, MachineTypeSpecs>
        {
            { MachineType.VisionV8, new MachineTypeSpecs(640,120, 120) },
            { MachineType.NUUK, new MachineTypeSpecs(600, 120, 120) },
            { MachineType.ComboPlus, new MachineTypeSpecs(480, 120, 120) }
        };
    }
}
