using System.Drawing;

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
        public int AccountId { get; set; }
        

        public Product() { }
        public Product(int id, string name, float height, float width, float depth, bool stable)
        {
            Id = id;
            Name = name;
            Height = height;
            Width = width;
            Depth = depth;
            Stable = stable;
        }
    }
}
