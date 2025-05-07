using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using VCT.API.Models.Clients;
using System.ComponentModel.Design.Serialization;
using api.Models.ManyToMany;

namespace VCT.API.Models.Accounts
{
    public class Account
    {
        public int Id { get; set; }  // This becomes the primary key
        public string? Name { get; set; }
        public string? Password { get; set; }
        
        public List<AccountClient> AccountClients {get;set;} = new List<AccountClient>();
        
        public List<AccountProduct> AccountProducts {get;set;} = new List<AccountProduct>();

    }

}
