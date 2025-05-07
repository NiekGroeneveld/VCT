using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Accounts;
using VCT.API.Models.Clients;

namespace api.Models.ManyToMany
{
    public class AccountClient
    {
        public int AccountId { get; set; }
        public Account Account { get; set; } = null!;

        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;
    }
}