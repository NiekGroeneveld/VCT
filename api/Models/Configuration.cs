using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Configuration
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        //Trays
        [MaxLength(8)]
        public ICollection<Tray> Trays { get; set; } = new List<Tray>();

        //One-To-Many
        public string ConfigurationType { get; set; } = string.Empty;
        public int ConfigurationTypeDataId { get; set; }
        public ConfigurationTypeData ConfigurationTypeData { get; set; } = new ConfigurationTypeData();


        //Elevator
        [Range(1, 4)]
        public int? ElevatorSetting { get; set; }
        public string? ElevatorAddition { get; set; } 

        //Many-To-One
        public int CompanyId { get; set; }
        public Company Company { get; set; } = new Company();
    }
}