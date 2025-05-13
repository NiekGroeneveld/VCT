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
    }

}