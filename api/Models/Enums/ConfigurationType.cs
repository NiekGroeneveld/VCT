using api.Models.Components;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using VCT.API.Models.Components;
using VCT.API.Models.Enums;

namespace api.Models.Enums
{
    public enum ConfigurationType
    {
        VisionV8Config,
        NUUKConfig,
        ComboPlusConfig
 
    }

    public static class ConfigurationTypeExtensions
    {
        public static string ConvertToString(this ConfigurationType configurationType)
        {
            return configurationType.ToString();
        }

        public static MachineType ToMachineType(this ConfigurationType configurationType)
        {
            return configurationType switch
            {
                ConfigurationType.VisionV8Config => MachineType.VisionV8,
                ConfigurationType.NUUKConfig => MachineType.NUUK,
                ConfigurationType.ComboPlusConfig => MachineType.ComboPlus,
                _ => throw new ArgumentOutOfRangeException(nameof(configurationType), configurationType, null)
            };

        }

        public static ConfigurationCharacteristics GetConfigurationCharacteristicsByConfigurationType(this ConfigurationType configurationType)
        {
            return configurationType.ToMachineType().GetConfigurationCharacteristicsByMachineType();
        }

    }

}