using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ProductDtos
{
    public class UpdateProductRequestDTO
    {
        [Required]
        [MinLength(4, ErrorMessage = "Name must be at least 4 characters long")]
        [MaxLength(50, ErrorMessage = "Name must be at most 50 characters long")]
        public string Name { get; set; }
        
        [Required]
        [Range(0, float.MaxValue, ErrorMessage = "Height must be a positive number")]
        public float Height { get; set; }

        [Required]
        [Range(0, float.MaxValue, ErrorMessage = "Height must be a positive number")]
        public float Width { get; set; }

        
        [Required]
        [Range(0, float.MaxValue, ErrorMessage = "Height must be a positive number")]
        public float Depth { get; set; }

        [Required]
        public bool Stable { get; set; }
    }
}