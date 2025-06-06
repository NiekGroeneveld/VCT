using api.Models.Components;
using api.Models.Enums;
using api.Models.Machines.MachineTypeData;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using VCT.API.Models.Machines;

namespace VCT.API.Models.Enums
{
    public enum MachineType
    {
        VisionV8,
        NUUK,
        ComboPlus

    }

    public static class MachineTypeExtensions
    {
        public static string GetName(this MachineType machineType)
        {
            return machineType.ToString();
        }

        
        public static ConfigurationType ToConfigurationType(this MachineType machineType) => machineType switch
        {
            MachineType.VisionV8 => ConfigurationType.VisionV8Config,
            MachineType.NUUK => ConfigurationType.NUUKConfig,
            MachineType.ComboPlus => ConfigurationType.ComboPlusConfig,
            _ => throw new ArgumentOutOfRangeException(nameof(machineType), machineType, null)
        };

        public static ConfigurationCharacteristics GetConfigurationCharacteristicsByMachineType(this MachineType machineType)
        {
            MachineTypeSpecs machineTypeSpecs = MachineTypeData.MachineTypeSpecs[machineType];
            return new ConfigurationCharacteristics(machineTypeSpecs.MachineType.ToConfigurationType(), machineTypeSpecs.Dots, machineTypeSpecs.WidthTray, machineTypeSpecs.Height);
        }
    }

}
