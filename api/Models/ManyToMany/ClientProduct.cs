using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Clients;
using VCT.API.Models.Products;

namespace api.Models.ManyToMany
{
    public class ClientProduct
    {
        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}