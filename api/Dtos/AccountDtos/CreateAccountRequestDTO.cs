using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.AccountDtos
{
    public class CreateAccountRequestDTO
    {
        public string? Name { get; set; }
        public string? Password { get; set; }
    }
}