using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ClientDtos
{
    public class CreateClientRequestDTO
    {
        [Required]
        [MinLength(8, ErrorMessage ="Username must be at least 8 characters long")]
        [MaxLength(40, ErrorMessage ="Username must be at most 40 characters long")]
        public required string Name { get; set; }
    }
}