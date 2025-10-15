using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Configuration
{
    public class CloneConfigurationDTO
    {
        [Required]
        [MinLength(1, ErrorMessage = "Configuration name must be at least 1 character")]
        [MaxLength(100, ErrorMessage = "Configuration name cannot exceed 100 characters")]
        public string NewName { get; set; } = string.Empty;
    }
}
