using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProductDtos;

using VCT.API.Models.Accounts;
using VCT.API.Models.Clients;
using VCT.API.Models.Products;



namespace api.Dtos.AccountDtos
{
    public class AccountDTO
    {
        public int Id { get; set; }  // This becomes the primary key
        public string? Name { get; set; }

        //Password was here, is deleted

        public List<Client> Clients { get; set; } = new();
        public List<ProductDTO> Products { get; set; } = new();
    }
}