using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public abstract class ElevatorConfig
    {

    }

    public class VisionV8ElevatorConfig : ElevatorConfig
    {
        public int ElevatorSetting { get; set; }
        public string ElevatorAssecories { get; set; } = string.Empty;
    }

    public class NuukElevatorConfig : ElevatorConfig
    {
    }
    
    public class OtherElevatorConfig : ElevatorConfig
    {
    }
}