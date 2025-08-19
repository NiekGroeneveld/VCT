using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TrayProduct
{
    public class TrayProductUpdateDTO
    {
        public int ProductId { get; set; }
        public int ProductChannelPosition { get; set; }
    }
}