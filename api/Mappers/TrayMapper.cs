using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.TrayDtos;
using VCT.API.Models.Components;

namespace api.Mappers
{
    public static class TrayMapper
    {
        public static TrayDTO ToTrayDTO(this Tray trayModel)
        {
            return new TrayDTO()
            {
                Id = trayModel.Id,
                ConfigurationId = trayModel.ConfigurationId,
                TrayNumber = trayModel.TrayNumber,
                TrayPosition = trayModel.TrayPosition,
                Dividers = trayModel.Dividers,
                Canals = trayModel.Canals //ToImplement
            };


        }
        
    }
}