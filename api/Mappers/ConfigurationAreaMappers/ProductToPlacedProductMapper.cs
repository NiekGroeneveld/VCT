using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;
using api.Models;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace api.Mappers.ConfigurationAreaMappers
{
    public static class ProductToPlacedProductMapper
    {
        public static PlacedProductDTO ToPlacedProductDTO(this TrayProduct TrayProduct, ConfigurationTypeData? configurationTypeData)
        {
            if (configurationTypeData == null) throw new InvalidOperationException("ConfigurationTypeData is required for product mapping");
            if (TrayProduct.Product == null) throw new InvalidOperationException("TrayProduct.Product is null");
            switch (TrayProduct.Product.Stable)
            {
                case true:
                    return new LowExtractorProductDTO
                    {
                        Id = TrayProduct.Product.Id,
                        Name = TrayProduct.Product.Name,
                        Width = TrayProduct.Product.Width,
                        Height = TrayProduct.Product.Height,
                        Depth = TrayProduct.Product.Depth,
                        Stable = TrayProduct.Product.Stable,
                        Color = TrayProduct.Product.ColorHex,
                        OnTrayIndex = TrayProduct.OnTrayIndex,
                        IsActive = TrayProduct.Product.IsActive,
                        PalletConfig = TrayProduct.Product.PalletConfig,
                        ExtractorType = "Low",
                        ExtractorHeight = configurationTypeData.LowExtractorHeight     
                    };
                case false:
                    return new HighExtractorProductDTO
                    {
                        Id = TrayProduct.Product.Id,
                        Name = TrayProduct.Product.Name,
                        Width = TrayProduct.Product.Width,
                        Height = TrayProduct.Product.Height,
                        Depth = TrayProduct.Product.Depth,
                        Stable = TrayProduct.Product.Stable,
                        Color = TrayProduct.Product.ColorHex,
                        OnTrayIndex = TrayProduct.OnTrayIndex,
                        IsActive = TrayProduct.Product.IsActive,
                        PalletConfig = TrayProduct.Product.PalletConfig,
                        ExtractorType = "High",
                        ExtractorHeight = configurationTypeData.HighExtractorHeight,
                        ClipDistance = 0 //GetClipDistance()
                    };
            }


            throw new ArgumentException("Unknown product type");
        }
    }
}