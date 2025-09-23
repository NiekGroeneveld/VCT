using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Configuration;
using api.Models;
using api.Mappers;

namespace api.Mappers
{
    public static class ConfigurationMapper
    {
        public static ConfigurationDTO ToDTO(this Configuration configuration)
        {
            return new ConfigurationDTO
            {
                Id = configuration.Id,
                Name = configuration.Name,
                Trays = configuration.Trays.Select(t => t.ToDTO()).ToList(),
                ConfigurationTypeId = configuration.ConfigurationTypeData.Id,
                ConfigurationType = configuration.ConfigurationTypeData.ConfigurationType,
                CompanyId = configuration.CompanyId
            };
        }

        public static Configuration ToConfigurationFromCreateDTO(this CreateConfigurationDTO configurationDto, ConfigurationTypeData configurationTypeData, Company company)
        {
            return new Configuration
            {
                Name = configurationDto.Name,
                Trays = new List<Tray>(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ConfigurationTypeDataId = configurationTypeData.Id,
                ConfigurationTypeData = configurationTypeData,
                ConfigurationType = configurationTypeData.ConfigurationType,
                ElevatorConfig = configurationTypeData.assignElevatorConfig(),
                CompanyId = company.Id,
                Company = company
            };
        }

        public static ConfigurationNameIdDTO ToNameIdDTO(this Configuration configuration)
        {
            return new ConfigurationNameIdDTO
            {
                Id = configuration.Id,
                Name = configuration.Name
            };
        }

        public static ElevatorConfig assignElevatorConfig(this ConfigurationTypeData configurationTypeData) => configurationTypeData.ConfigurationType switch
        {
            "VisionV8" => new VisionV8ElevatorConfig { ElevatorSetting = 1, ElevatorAssecories = "Leeg" },
            "Nuuk" => new NuukElevatorConfig { },
            _ => new OtherElevatorConfig { } // Default case
        };

    };
}

