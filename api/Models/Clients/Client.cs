using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using System.ComponentModel.Design.Serialization;


namespace VCT.API.Models.Clients
{
    public class Client
    {
        public int Id {get; set;}
        public string Name { get; set; }
        public List<Product> Products = new List<Product>();
        public List<MasterMachine> Machines = new List<MasterMachine>();

        internal Client(int id, string name) 
        {
            Id = id;
            Name = name;
        }

        void addMachine() { throw new NotImplementedException(); }
        void addProduct() { throw new NotImplementedException(); }


    }

}
