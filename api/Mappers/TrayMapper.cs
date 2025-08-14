using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.Models;
using api.DTOs.Product;

namespace api.Mappers
{
    public static class TrayMapper
    {
        public static TrayDTO toDTO(this Tray tray)
        {
            return new TrayDTO
            {
                Id = tray.Id,
                Products = tray.Products?.Select(p => p.toDTO()).ToList() ?? new List<ProductDTO>(),
                TrayPosition = tray.TrayPosition,
                ConfigId = tray.Configuration.Id
            };
        }

        public static Tray toTrayFromCreateDTO(this CreateTrayDTO trayDto)
        {
            return new Tray
            {
                TrayPosition = trayDto.TrayPosition,
                Products = trayDto.Products.Select(p => p.toProduct()).ToList(),
                TrayConfig = string.Empty, //Algorithm service placed here later on.
                Configuration = null, //add functionality later on when the Configuration repository is ready
                UpdatedAt = DateTime.UtcNow

            };
        }

        public static Tray toTrayFromUpdateDTO(this UpdateTrayDTO trayDto, Tray existingTray)
        {
            existingTray.Products = trayDto.Products.Select(p => p.toProduct()).ToList();
            existingTray.TrayPosition = trayDto.TrayPosition;
            existingTray.UpdatedAt = DateTime.UtcNow;
            return existingTray;
        }

    }
}