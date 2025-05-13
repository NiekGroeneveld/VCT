using System.ComponentModel.DataAnnotations.Schema;
using VCT.API.Models.Components;
using VCT.API.Models.Enums;

namespace VCT.API.Models.Machines
{
    public abstract class Machine
    {
        
        public int MachineNumber { get; set; }
        public MachineType MachineType { get; set; }
        
        
        public int? ConfigId { get; set; }
        
        [ForeignKey("ConfigId")]
        public Configuration Config { get; set; } = new Configuration();


        public void InitializeConfig()
        {
            Config = new Configuration();
            Config.InitializeFromMachineType(MachineType);
        }

    }
}
