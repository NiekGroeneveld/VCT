using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Accounts;
using VCT.API.Models.Clients;
using VCT.API.Models.Products;

namespace api.Dtos.AccountDtos
{
    public class UpdateAccountRequestDTO
    {
        public string? Name { get; set; }

        public string? Password { get; set; }

        public List<Client> Clients { get; set; } = new();
        public List<Product> Products { get; set; } = new();
    }
}