using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Users;
using VCT.API.Models.Clients;

namespace api.Models.ManyToMany
{
    public class UserClient
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;
    }
}