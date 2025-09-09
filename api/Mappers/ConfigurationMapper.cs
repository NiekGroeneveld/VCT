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

    };
}

