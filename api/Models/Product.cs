
using System.Drawing;

namespace api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        //Data
        public string ProductConfig { get; set; } = string.Empty;
        public float Height { get; set; }
        public float Width { get; set; }
        public float Depth { get; set; }
        public bool Stable { get; set; }
        public Color color { get; set; } = Color.White;
        public bool IsActive { get; set; } = true;

        //One-To-Many
        public Company? company { get; set; }

        //Many-To-Many
        public ICollection<Tray> Trays { get; set; } = new List<Tray>();
    }
}