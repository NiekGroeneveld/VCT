using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.ConfigurationTypeData;
using api.DTOs.Tray;
using api.Models;
using Humanizer;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.DTOs.Configuration
{
    public class ConfigurationAreaDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<ConfigurationAreaTrayDTO> Trays { get; set; }
        public string ConfigurationType { get; set; } = string.Empty;


        public ConfigurationTypeDataDTO ConfigurationTypeData { get; set; }

        //Elevator
        public int? ElevatorSetting { get; set; }
        public string? ElevatorAddition { get; set; }


        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
    }
}