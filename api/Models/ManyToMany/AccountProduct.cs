using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Accounts;
using VCT.API.Models.Products;

namespace api.Models.ManyToMany
{
    public class AccountProduct
    {
        public int AccountId { get; set; }
        public Account Account { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}