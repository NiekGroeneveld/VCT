using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;

namespace api.DTOs.Tray
{
    public class ConfigurationAreaTrayDTO
    {
        public int Id { get; set; }
        public float TrayWidth { get; set; }
        public float TrayHeight { get; set; }
        public ICollection<PlacedProductDTO> Products { get; set; }
        public int DotPosition { get; set; }
        

    }
}