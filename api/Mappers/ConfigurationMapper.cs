using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ConfigurationDtos;
using Microsoft.OpenApi.Extensions;
using VCT.API.Models.Components;
using api.Interfaces;
using api.Models.Enums;

namespace api.Mappers
{
    public static class ConfigurationMapper
    {
        public static ConfigurationDTO ToConfigurationDTO(this Configuration configuration)
        {
            return new ConfigurationDTO{
                Id = configuration.Id,
                Name = configuration.Name,
                ConfigurationType = configuration.ConfigurationType.ToString(),
                Trays = configuration.Trays.Select(t => t).ToList()
            };
        }

        public static Configuration ToConfigurationFromCreateDTO(this CreateConfigurationRequestDTO createConfigurationRequestDTO, int MachineId, ConfigurationType ConfigType)
        {
            return new Configuration{
                Name = createConfigurationRequestDTO.Name,
                MachineId = MachineId,
                ConfigurationType = ConfigType
            };
        }
    }
}