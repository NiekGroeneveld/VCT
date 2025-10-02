using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Configuration;
using api.Models;
using api.Mappers;
using Microsoft.CodeAnalysis.CSharp.Syntax;

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
                ConfigurationTypeData = configuration.ConfigurationTypeData.ToDTO(),
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
                ElevatorSetting = SetElevatorSetting(configurationTypeData.ConfigurationType),
                ElevatorAddition = SetElevatorAddition(configurationTypeData.ConfigurationType),
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

        private static string? SetElevatorAddition(string ConfigurationType)
        {
            if (ConfigurationType == "VisionV8")
            {
                return "Leeg";
            }
            else if (ConfigurationType == "Nuuk")
            {
                return null;
            }
            else if (ConfigurationType == "Other")
            {
                return null;
            }
            return null;
        }

        private static int? SetElevatorSetting(string ConfigurationType)
        {
            if (ConfigurationType == "VisionV8")
            {
                return 1;
            }
            else if (ConfigurationType == "Nuuk")
            {
                return null;
            }
            else if (ConfigurationType == "Other")
            {
                return null;
            }
            return null;
        }

    };
}

