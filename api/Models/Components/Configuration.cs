using VCT.API.Models.Machines;
using VCT.API.Models.Enums;
using api.Models.Enums;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace VCT.API.Models.Components
{
    public class Configuration
    {
        public int Id { get; set; }
        public List<Tray> Trays { get; set; } = new List<Tray>();
        public string? Name { get; set; }
        
        
        //NavigationType
        public int MachineId { get; set; }
        public ConfigurationType ConfigurationType { get; set; }
        
        public Configuration() {}

        public void InitializeFromMachineType(MachineType machineType) => ConfigurationType = machineType.ToConfigurationType();
    }
}