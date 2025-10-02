using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;
using api.DTOs.Tray;
using api.Models;

namespace api.Mappers.ConfigurationAreaMappers
{
    public static class TrayToConfigurationAreaTrayDTO
    {
        public static ConfigurationAreaTrayDTO ToConfigurationAreaTrayDTO(this Tray tray, ConfigurationTypeData? configTypeData)
        {
            if (configTypeData == null) throw new InvalidOperationException("ConfigurationTypeData is required for tray mapping");
            List<PlacedProductDTO> placedProducts = tray.TrayProducts
                .Select(tp => tp.ToPlacedProductDTO(configTypeData))
                .ToList();
            return new ConfigurationAreaTrayDTO
            {
                Id = tray.Id,
                TrayWidth = configTypeData.TrayWidth,
                TrayHeight = getTrayHeight(placedProducts, configTypeData),
                Products = placedProducts.OrderBy(p => p.OnTrayIndex).ToList(),
                DotPosition = tray.TrayPosition
            };
        }

        private static float getTrayHeight(List<PlacedProductDTO> placedProducts, ConfigurationTypeData configTypeData)
        {
            float MaxHeight = configTypeData.MinTrayHeight;
            foreach(PlacedProductDTO placedProduct in placedProducts)
            {
                float productheight = placedProduct.Height + placedProduct.ExtractorHeight;
                MaxHeight = Math.Max(MaxHeight, productheight);
            }
            return MaxHeight;
        }
    }
}