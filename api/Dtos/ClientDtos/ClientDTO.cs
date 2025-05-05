using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Machines;
using VCT.API.Models.Products;

namespace api.Dtos.ClientDtos
{
    public class ClientDto
    {
        public int Id {get; set;}
        public required string Name { get; set; }
        public List<Product> Products = new List<Product>();
        public List<MasterMachine> Machines = new List<MasterMachine>();
    }
}