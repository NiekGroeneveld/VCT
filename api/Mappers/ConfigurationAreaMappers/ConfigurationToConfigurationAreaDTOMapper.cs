using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Configuration;
using api.Models;

namespace api.Mappers.ConfigurationAreaMappers
{
    public static class ConfigurationToConfigurationAreaDTOMapper
    {
        public static ConfigurationAreaDTO ToConfigurationAreaDTO(this Configuration configArea)
        {
            return new ConfigurationAreaDTO
            {
                Id = configArea.Id,
                Name = configArea.Name,
                Trays = configArea.Trays
                    .OrderBy(t => t.TrayPosition)
                    .Select(t => t.ToConfigurationAreaTrayDTO(configArea.ConfigurationTypeData))
                    .ToList(),
                CreatedAt = configArea.CreatedAt,
                UpdatedAt = configArea.UpdatedAt
            };
        }
    }
}