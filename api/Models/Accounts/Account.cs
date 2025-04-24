using VCT.API.Models.Products;
using VCT.API.Models.Machines;
using VCT.API.Models.Clients;
using System.ComponentModel.Design.Serialization;

namespace VCT.API.Models.Accounts
{
    public class Account
    {
        public int Id { get; set; }  // This becomes the primary key
        public string? Name { get; set; }
        public string? Password { get; set; }
        public List<Client> Clients { get; set; } = new();
        public List<Product> Products { get; set; } = new();


        public void AddMachine() { throw new NotImplementedException(); }
        public void AddProduct() { throw new NotImplementedException(); }
    }

}
