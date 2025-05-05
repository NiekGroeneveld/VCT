using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProductDtos;
using VCT.API.Models.Machines;
using VCT.API.Models.Products;

namespace api.Dtos.ClientDtos
{
    public class ClientDTO
    {
        public int Id {get; set;}
        public required string Name { get; set; }
        public List<ProductDTO> Products = new();
        public List<MasterMachine> Machines = new();
    }
}