using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;

namespace api.DTOs.Tray
{
    public class UpdateTrayDTO
    {
        public ICollection<ProductDTO> Products { get; set; } = new List<ProductDTO>();
        public int TrayPosition { get; set; }
    }
}