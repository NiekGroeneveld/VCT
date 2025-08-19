using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;
using api.Models;

namespace api.Mappers
{
    public static class ProductMapper
    {
        public static ProductDTO ToDTO(this Product product)
        {
            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Height = product.Height,
                Width = product.Width,
                Depth = product.Depth,
                Stable = product.Stable,
                CompanyName = product.Company?.Name ?? "No Company", // Handle null company
                ColorHex = product.ColorHex
            };
        }

        public static Product ToProduct(this ProductDTO productDto)
        {
            return new Product
            {
                Id = productDto.Id,
                Name = productDto.Name,
                Height = productDto.Height,
                Width = productDto.Width,
                Depth = productDto.Depth,
                Stable = productDto.Stable,
                ColorHex = productDto.ColorHex,
                Company = null //implement when controller is ready
            };
        }

        public static Product toProductFromCreateDTO(this CreateProductDTO productDto)
        {
            return new Product
            {
                Name = productDto.Name,
                Height = productDto.Height,
                Width = productDto.Width,
                Depth = productDto.Depth,
                Stable = productDto.Stable,
                ColorHex = productDto.ColorHex,
                CreatedAt = DateTime.UtcNow,
                Company = null //add functionality later on when the Company repository is ready
            };
        }

        public static Product toProductFromUpdateDTO(this UpdateProductDTO productDto, Product existingProduct)
        {
            existingProduct.Name = productDto.Name;
            existingProduct.Height = productDto.Height;
            existingProduct.Width = productDto.Width;
            existingProduct.Depth = productDto.Depth;
            existingProduct.Stable = productDto.Stable;
            existingProduct.ColorHex = productDto.ColorHex;
            return existingProduct;
        }

        public static MinimalProductDTO ToMinimalDTO(this Product product)
        {
            return new MinimalProductDTO
            {
                Id = product.Id,
                Name = product.Name
            };
        }
    }
}