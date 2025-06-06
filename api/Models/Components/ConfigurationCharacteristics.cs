using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models.Enums;
using api.Models.Machines.MachineTypeData;
using VCT.API.Models.Enums;
using VCT.API.Models.Machines;

namespace api.Models.Components
{
    public class ConfigurationCharacteristics
    {
        ConfigurationType ConfigType { get; set; }
        public int Dots { get; set; }
        public int WidthTray { get; set; }
        public int Height { get; set; }

        public ConfigurationCharacteristics(ConfigurationType configType, int dots, int widthTray, int height)
        {
            ConfigType = configType;
            Dots = dots;
            WidthTray = widthTray;
            Height = height;
        }
                
    }
}