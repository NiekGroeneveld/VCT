using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Components;

namespace api.Dtos.ConfigurationDtos
{
    public class ConfigurationDTO
    {
        public int Id { get; set; }
        public List<Tray> Trays { get; set; } = new List<Tray>();
        public string? Name { get; set; }
        public required string ConfigurationType { get; set; }
    }
}