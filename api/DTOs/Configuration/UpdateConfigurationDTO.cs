using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.Models;

namespace api.DTOs.Configuration
{
    public class UpdateConfigurationDTO
    {
        public string Name { get; set; } = string.Empty;
        public ICollection<UpdateTrayDTO> Trays { get; set; } = new List<UpdateTrayDTO>();
    }

}       