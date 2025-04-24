using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Products;
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
    }
}