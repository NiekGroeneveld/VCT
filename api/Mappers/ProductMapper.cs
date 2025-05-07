using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProductDtos;
using VCT.API.Models.Products;

namespace api.Mappers
{
    public static class ProductMapper
    {
        public static ProductDTO ToProductDTO(this Product productModel)
        {
            return new ProductDTO
            {
                Id = productModel.Id,
                Name = productModel.Name,
                Height = productModel.Height,
                Width = productModel.Width,
                Depth = productModel.Depth,
                Stable = productModel.Stable
            };
        }

        public static Product ToProductFromCreateDTO(this CreateProductDTO productDTO)
        {
            //AccountID, assigning to Account Later on
            return new Product
            {
                Name = productDTO.Name,
                Height = productDTO.Height,
                Width = productDTO.Width,
                Depth = productDTO.Depth,
                Stable = productDTO.Stable,
            };
        }

        public static Product ToProductFromUpdateDTO(this UpdateProductRequestDTO updateDTO)
        {
               
            return new Product
            {
                Name = updateDTO.Name,
                Height = updateDTO.Height,
                Width = updateDTO.Width,
                Depth = updateDTO.Depth,
                Stable = updateDTO.Stable,
            };
        }


        
    }
}