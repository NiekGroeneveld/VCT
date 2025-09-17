using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;

namespace api.DTOs.TrayProduct
{
    public class TrayProductDetailDTO
    {
        public ProductDTO Product { get; set; } = new ProductDTO();
        public int OnTrayIndex { get; set; }
    }
}