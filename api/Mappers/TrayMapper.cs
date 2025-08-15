using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.Models;
using api.DTOs.Product;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Mappers
{
    public static class TrayMapper
    {
        public static TrayDTO ToDTO(this Tray tray)
        {
            return new TrayDTO
            {
                Id = tray.Id,
                Products = tray.Products?.Select(p => p.toMinimalDTO()).ToList() ?? new List<MinimalProductDTO>(),
                TrayPosition = tray.TrayPosition,
                ConfigId = tray.Configuration.Id
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

        public static Tray ToTrayFromUpdateDTO(this UpdateTrayDTO trayDto, Tray existingTray, ICollection<Product> products)
        {
            existingTray.Products = products;
            existingTray.TrayPosition = trayDto.TrayPosition;
            existingTray.UpdatedAt = DateTime.UtcNow;
            return existingTray;
        }

    }
}