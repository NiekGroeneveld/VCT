using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using VCT.API.Models.Clients;
using System.ComponentModel.Design.Serialization;
using api.Models.ManyToMany;
using Microsoft.AspNetCore.Identity;

namespace VCT.API.Models.Users
{
    public class User : IdentityUser
    {
        public List<UserClient> UserClients {get;set;} = new List<UserClient>();
        public List<UserProduct> UserProducts {get;set;} = new List<UserProduct>();

    }

}
