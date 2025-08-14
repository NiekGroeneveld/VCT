using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;

namespace api.DTOs.Tray
{
    public class TrayDTO
    {
        public int Id { get; set; }
        public ICollection<MinimalProductDTO> Products { get; set; } = new List<MinimalProductDTO>();
        public int TrayPosition { get; set; }
        public int ConfigId { get; set; }
    }
}