using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using System.ComponentModel.Design.Serialization;
using Microsoft.Identity.Client;


namespace VCT.API.Models.Clients
{
    public class Client
    {
        public int Id {get; set;}
        public string Name { get; set; }
        public List<Product> Products {get; set;}= new List<Product>();
        public List<MasterMachine> Machines {get; set;}= new List<MasterMachine>();

        //Addition
        public int AccountId { get; set; } 

        public Client() { }
        
        internal Client(int id, string name) 
        {
            Id = id;
            Name = name;
        }

    }

}
