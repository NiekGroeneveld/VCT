using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TrayProduct;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class TrayProductMapper
    {
        public static TrayProductDetailDTO ToDTO(this TrayProduct trayProduct)
        {
            return new TrayProductDetailDTO
            {
                Product = trayProduct.Product.ToDTO(),
                ProductChannelPosition = trayProduct.ProductChannelPosition
            };
        }

        public static TrayProduct ToTrayProductFromDTO(this TrayProductUpdateDTO trayProductDto, int trayId)
        {
            return new TrayProduct
            {
                TrayId = trayId,
                ProductId = trayProductDto.ProductId,
                ProductChannelPosition = trayProductDto.ProductChannelPosition
            };
        }
    }
}