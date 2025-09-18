using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.DTOs.Configuration
{
    public class ConfigurationAreaDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<ConfigurationAreaTrayDTO> Trays { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}