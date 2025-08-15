using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace api.DTOs.Configuration
{
    public class CreateConfigurationDTO
    {
        public string Name { get; set; } = string.Empty;
        
        public string ConfigurationType { get; set; } = string.Empty;
        //Many-To-One
        public int CompanyId { get; set; }
    }
}