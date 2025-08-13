using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class ConfigurationTypeData
    {
        public int Id { get;}
        public string ConfigurationType { get;} = string.Empty;

        //Data
        //TraySpecs
        public float MinTrayHeight { get; }
        public float TrayWidth { get; }
        //MachineDimensions
        public float ConfigHeight { get; }
        public int AmountDots { get; }
        public float DotsDelta { get; }

        //ExtractorSpecs
        public float LowExtractorHeight { get; }
        public float LowExtractorDepth { get; }
        public float HighExtractorHeight { get; }
        public float HighExtractorDepth { get; }
        public float PalletDelta { get; }




        //For many to one
        public ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();


    }
}