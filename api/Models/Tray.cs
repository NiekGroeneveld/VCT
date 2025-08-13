using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Tray
    {
        public int Id { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public string TrayConfig { get; set; } = string.Empty;
        public int TrayPosition { get; set; }

        public DateTime CreatedAt { get; set; }
        public Configuration Configuration { get; set; } = new Configuration();

    }
}