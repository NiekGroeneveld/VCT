using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.Models;
using api.DTOs.Product;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using api.DTOs.TrayProduct;

namespace api.Mappers
{
    public static class TrayMapper
    {
        public static TrayDTO ToDTO(this Tray tray)
        {
            return new TrayDTO
            {
                Id = tray.Id,
                TrayPosition = tray.TrayPosition,
                ConfigId = tray.Configuration?.Id ?? 0,
                Products = tray.TrayProducts?.Select(tp => new TrayProductDetailDTO
                {
                    Product = tp.Product.ToDTO(),
                    ProductChannelPosition = tp.ProductChannelPosition
                }).OrderBy(tp => tp.ProductChannelPosition).ToList() ?? new List<TrayProductDetailDTO>()
            };
        }

        public static Tray ToTrayFromCreateDTO(this CreateTrayDTO trayDto, Configuration configuration)
        {
            return new Tray
            {
                TrayPosition = trayDto.TrayPosition,
                TrayConfig = string.Empty, //Algorithm service placed here later on.
                Configuration = configuration,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public static Tray ToTrayFromUpdateDTO(this UpdateTrayDTO trayDto, Tray existingTray)
        {
            existingTray.TrayPosition = trayDto.TrayPosition;
            existingTray.UpdatedAt = DateTime.UtcNow;
            return existingTray;
        }

    }
}