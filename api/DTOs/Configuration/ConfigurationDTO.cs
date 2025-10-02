using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.DTOs.ConfigurationTypeData;

namespace api.DTOs.Configuration
{
    public class ConfigurationDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<TrayDTO> Trays { get; set; } = new List<TrayDTO>();

        //One-To-Many
        public int ConfigurationTypeId { get; set; }
        public string ConfigurationType { get; set; } = string.Empty;
        public ConfigurationTypeDataDTO ConfigurationTypeData { get; set; } = new ConfigurationTypeDataDTO();


        //Many-To-One
        public int CompanyId { get; set; }
    }
}