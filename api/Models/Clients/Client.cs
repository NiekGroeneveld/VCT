using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using System.ComponentModel.Design.Serialization;
using Microsoft.Identity.Client;
using api.Models.ManyToMany;
using VCT.API.Models.Accounts;


namespace VCT.API.Models.Clients
{
    public class Client
    {
        public int Id {get; set;}
        public string Name { get; set; }
        public List<MasterMachine> Machines {get; set;}= new List<MasterMachine>();
        
        
        public List<AccountClient> AccountClients {get; set;}= new List<AccountClient>();
        public List<ClientProduct> ClientProducts {get; set;}= new List<ClientProduct>();

        public Client() { }
    }

}
