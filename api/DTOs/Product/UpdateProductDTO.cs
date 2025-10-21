using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Product
{
    public class UpdateProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public float Height { get; set; }
        public float Width { get; set; }
        public float Depth { get; set; }
        public bool Stable { get; set; }
        public string ColorHex { get; set; } = "#FFFFFF";
        public string PalletConfig { get; set; } = string.Empty;   
        public bool IsActive { get; set; } 
    }
}