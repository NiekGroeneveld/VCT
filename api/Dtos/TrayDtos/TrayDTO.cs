using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Components;

namespace api.Dtos.TrayDtos
{
    public class TrayDTO
    {
        public int Id { get; set; }
        public int ConfigurationId { get; set; }
        public int TrayNumber { get;set;}
        public int TrayPosition { get; set;}
        public List<Canal> Canals { get; set;} = new List<Canal>();
        public List<int> Dividers { get; set;} = new List<int>();
    }
}