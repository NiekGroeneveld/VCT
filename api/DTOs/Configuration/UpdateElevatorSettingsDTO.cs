using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Configuration
{
    public class UpdateElevatorSettingsDTO
    {
        [Required]
        [Range(0, 4, ErrorMessage = "ElevatorSetting must be a non-negative integer.")]
        public int ElevatorSetting { get; set; }
        
        [Required]
        [AllowedValues("Leeg", "schuimbodem en schuimrand", "Rollenbaantje", "Glijplaat", ErrorMessage = "ElevatorAddition must be one of: Leeg, schuimbodem en schuimrand, Rollenbaantje, Glijplaat")]
        public string ElevatorAddition { get; set; } = string.Empty;
    }
}