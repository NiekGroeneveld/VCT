using System;
using System.Collections.Generic;
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
        public ICollection<Tray> Trays { get; set; } = new List<Tray>();

        //One-To-Many
        public string ConfigurationType { get; set; } = string.Empty;
        public ConfigurationTypeData ConfigurationTypeData { get; set; } = new ConfigurationTypeData();



        //Many-To-One
        public int CompanyId { get; set; }
        public Company Company { get; set; } = new Company();
    }
}