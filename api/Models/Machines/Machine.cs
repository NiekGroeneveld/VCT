using VCT.API.Models.Components;
using VCT.API.Models.Enums;

namespace VCT.API.Models.Machines
{
    public abstract class Machine
    {
        public int id { get; set; }
        public int MachineNumber { get; set; }
        public MachineType Type { get; set; }
        public Configuration? Config { get; set; }
        public void InitializeConfig()
        {
            Config = new Configuration(Type);
        }

    }
}
