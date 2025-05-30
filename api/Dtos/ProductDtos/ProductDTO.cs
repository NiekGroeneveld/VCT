using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ProductDtos
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public float Height { get; set; }
        public float Width { get; set; }
        public float Depth { get; set; }
        public bool Stable { get; set; }
    }
}