using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Enums;

namespace api.Dtos.MachineDtos
{
    public class UpdateMachineRequestDTO
    {
        [Required]
        [MinLength(8, ErrorMessage = "Name must be at least 8 characters long")]
        [MaxLength(70, ErrorMessage = "Name must be at most 70 characters long")]
        public required string Name { get; set; }
        
        [Required]
        [Range(0, float.MaxValue, ErrorMessage = "This client ID is too big or in a wrong format!")]
        public int ClientId { get; set; }
    }
}