using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class TrayProduct
    {

        public int Id { get; set; }
        public int TrayId { get; set; }
        public int ProductId { get; set; }
        [Range(1, 10)]
        public int ProductChannelPosition { get; set; }
        public DateTime CreatedAt { get; set; }

        //Navigation Properties
        public Tray Tray { get; set; } = new Tray();
        public Product Product { get; set; } = new Product(); 
    }
}