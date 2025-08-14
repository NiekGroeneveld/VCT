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
        public static TrayDTO toDTO(this Tray tray)
        {
            return new TrayDTO
            {
                Id = tray.Id,
                Products = tray.Products?.Select(p => p.toMinimalDTO()).ToList() ?? new List<MinimalProductDTO>(),
                TrayPosition = tray.TrayPosition,
                ConfigId = tray.Configuration.Id
            };
        }

        public static Tray toTrayFromCreateDTO(this CreateTrayDTO trayDto, ICollection<Product> products)
        {
            return new Tray
            {
                TrayPosition = trayDto.TrayPosition,
                Products = products,
                TrayConfig = string.Empty, //Algorithm service placed here later on.
                Configuration = null, //add functionality later on when the Configuration repository is ready
                UpdatedAt = DateTime.UtcNow

            };
        }

        public static Tray toTrayFromUpdateDTO(this UpdateTrayDTO trayDto, Tray existingTray, ICollection<Product> products)
        {
            existingTray.Products = products;
            existingTray.TrayPosition = trayDto.TrayPosition;
            existingTray.UpdatedAt = DateTime.UtcNow;
            return existingTray;
        }

    }
}