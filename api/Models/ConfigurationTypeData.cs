using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class ConfigurationTypeData
    {
        public int Id { get; set; }
        public string ConfigurationType { get; set; } = string.Empty;

        //Data
        //TraySpecs
        public float MinTrayHeight { get; set; }
        public float TrayWidth { get; set; }
        //MachineDimensions
        public float ConfigHeight { get; set; }


        //DotSpecs
        public int AmountDots { get; set; }
        public float DotsDelta { get; set; }
        public List<int> DoubleDotPositions { get; set; } = new List<int>();
        public List<int> ElevatorDotIndicators { get; set; } = new List<int>();


        //ExtractorSpecs
        public float LowExtractorHeight { get; set; }
        public float LowExtractorDepth { get; set; }
        public float HighExtractorHeight { get; set; }
        public float HighExtractorDepth { get; set; }
        public float PalletDelta { get; set; }

        //For many to one
        public ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();
    }
}