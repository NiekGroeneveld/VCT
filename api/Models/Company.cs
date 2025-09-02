using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        //Many-To-Many
        public ICollection<AppUser> Users { get; set; } = new List<AppUser>();


        //One-To-Many
        public ICollection<Configuration> Configurations { get; set; } = new List<Configuration>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}