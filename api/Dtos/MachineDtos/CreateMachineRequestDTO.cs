using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VCT.API.Models.Enums;

namespace api.Dtos.MachineDtos
{
    public class CreateMachineRequestDTO
    {
        [Required]
        [MinLength(8, ErrorMessage = "Name must be at least 8 characters long")]
        [MaxLength(70, ErrorMessage = "Name must be at most 70 characters long")]
        public required string Name { get; set; }
        
        [Required]
        [MinLength(8, ErrorMessage = "Name must be at least 8 characters long")]
        [MaxLength(70, ErrorMessage = "Name must be at most 70 characters long")]
        public required String Type { get; set; }


        public MachineType ToMachineType()
        {
            if (Enum.TryParse<MachineType>(Type, true, out var machineType))
            {
                return machineType;
            }
            throw new InvalidOperationException($"'{Type}' is not a valid MachineType");
        }

    }
}