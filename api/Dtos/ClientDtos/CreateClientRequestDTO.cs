using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ClientDtos
{
    public class CreateClientRequestDTO
    {
        public required string Name { get; set; }
    }
}