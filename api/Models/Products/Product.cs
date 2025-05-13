using System.Drawing;
using api.Models.ManyToMany;
using VCT.API.Models.Accounts;
using VCT.API.Models.Clients;
using VCT.API.Models.Components;

namespace VCT.API.Models.Products
{
    public class Product
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public float Height { get; set; }
        public float Width { get; set; }
        public float Depth { get; set; }
        public bool Stable { get; set; }
        
        //One-to-Many Relationship
        public List<Canal> Canals { get; set; } = new List<Canal>();
        
        
        //Many-To-Many Relationships
        public List<AccountProduct> AccountProducts { get; set;} = new List<AccountProduct>();
        public List<ClientProduct> ClientProducts { get; set;} = new List<ClientProduct>();


        public Product() { }
    }
}
