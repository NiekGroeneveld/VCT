using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;
using api.DTOs.TrayProduct;

namespace api.DTOs.Tray
{
    public class TrayDTO
    {
        public int Id { get; set; }
        public ICollection<TrayProductDetailDTO> Products { get; set; } = new List<TrayProductDetailDTO>();
        public int TrayPosition { get; set; }
        public int ConfigId { get; set; }
    }
}