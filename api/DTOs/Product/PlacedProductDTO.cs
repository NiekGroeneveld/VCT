using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Humanizer;

namespace api.DTOs.Product
{
    public abstract class PlacedProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float Height { get; set; }
        public float Width { get; set; }
        public float Depth { get; set; }

        public bool Stable { get; set; }
        public string Color { get; set; }
        public bool IsActive { get; set; }
        public string PalletConfig { get; set; }

        public int OnTrayIndex { get; set; }
        public string ExtractorType { get; set; } 
        public float ExtractorHeight { get; set; }
    }

    public class LowExtractorProductDTO : PlacedProductDTO
    {

    }

    public class HighExtractorProductDTO : PlacedProductDTO
    {
        public float ClipDistance{ get; set; }
    }
}