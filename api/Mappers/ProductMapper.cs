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
                ColorHex = product.ColorHex,
                IsActive = product.IsActive,
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
                Company = null //added later in controller
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
                IsActive = true // New products are active by default
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
            existingProduct.IsActive = productDto.IsActive;
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