using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Configuration;
using api.DTOs.Product;

namespace api.DTOs.Company
{
    public class CompanyDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;


        //One-To-Many
        public ICollection<ConfigurationDTO> Configurations { get; set; } = new List<ConfigurationDTO>();
        public ICollection<MinimalProductDTO> Products { get; set; } = new List<MinimalProductDTO>();

    }
}