using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace api.Models
{
    public class Tray
    {
        public int Id { get; set; }
        public ICollection<TrayProduct> TrayProducts { get; set; } = new List<TrayProduct>();
        public string TrayConfig { get; set; } = string.Empty;
        public int TrayPosition { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Configuration Configuration { get; set; } = new Configuration();

        [NotMapped]
        public IEnumerable<Product> Products => TrayProducts.OrderBy(tp => tp.ProductChannelPosition).Select(tp => tp.Product);
    }
}