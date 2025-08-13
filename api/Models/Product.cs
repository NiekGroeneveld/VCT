
using System.Drawing;
using System.ComponentModel.DataAnnotations.Schema;

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
        
        // Store color as hex string (e.g., "#FFFFFF", "#FF0000")
        public string ColorHex { get; set; } = "#FFFFFF";
        
        // Helper property to get/set Color object (not mapped to database)
        [NotMapped]
        public Color Color 
        { 
            get => ColorTranslator.FromHtml(ColorHex);
            set => ColorHex = ColorTranslator.ToHtml(value);
        }
        
        public bool IsActive { get; set; } = true;

        //One-To-Many
        public Company? company { get; set; }

        //Many-To-Many
        public ICollection<Tray> Trays { get; set; } = new List<Tray>();
    }
}