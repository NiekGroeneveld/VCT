using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.ConfigurationTypeData;
using api.Models;

namespace api.Mappers
{
    public static class ConfigurationTypeDataMapper
    {
        public static ConfigurationTypeDataDTO ToDTO(this ConfigurationTypeData configurationTypeData)
        {
            return new ConfigurationTypeDataDTO
            {
                Id = configurationTypeData.Id,
                ConfigurationType = configurationTypeData.ConfigurationType,
                MinTrayHeight = configurationTypeData.MinTrayHeight,
                TrayWidth = configurationTypeData.TrayWidth,
                ConfigHeight = configurationTypeData.ConfigHeight,
                AmountDots = configurationTypeData.AmountDots,
                DotsDelta = configurationTypeData.DotsDelta,
                LowExtractorHeight = configurationTypeData.LowExtractorHeight,
                LowExtractorDepth = configurationTypeData.LowExtractorDepth,
                HighExtractorHeight = configurationTypeData.HighExtractorHeight,
                HighExtractorDepth = configurationTypeData.HighExtractorDepth,
                PalletDelta = configurationTypeData.PalletDelta
            };
        }

        public static ConfigurationTypeData ToConfigurationTypeDataFromCreateDTO(this CreateConfigurationTypeDataDTO createDto)
        {
            return new ConfigurationTypeData
            {
                ConfigurationType = createDto.ConfigurationType,
                MinTrayHeight = createDto.MinTrayHeight,
                TrayWidth = createDto.TrayWidth,
                ConfigHeight = createDto.ConfigHeight,
                AmountDots = createDto.AmountDots,
                DotsDelta = createDto.DotsDelta,
                LowExtractorHeight = createDto.LowExtractorHeight,
                LowExtractorDepth = createDto.LowExtractorDepth,
                HighExtractorHeight = createDto.HighExtractorHeight,
                HighExtractorDepth = createDto.HighExtractorDepth,
                PalletDelta = createDto.PalletDelta
            };
        }

        public static ConfigurationTypeData ToConfigurationTypeDataFromUpdateDTO(this UpdateConfigurationTypeDataDTO updateDto, ConfigurationTypeData existingData)
        {
            existingData.ConfigurationType = updateDto.ConfigurationType;
            existingData.MinTrayHeight = updateDto.MinTrayHeight;
            existingData.TrayWidth = updateDto.TrayWidth;
            existingData.ConfigHeight = updateDto.ConfigHeight;
            existingData.AmountDots = updateDto.AmountDots;
            existingData.DotsDelta = updateDto.DotsDelta;
            existingData.LowExtractorHeight = updateDto.LowExtractorHeight;
            existingData.LowExtractorDepth = updateDto.LowExtractorDepth;
            existingData.HighExtractorHeight = updateDto.HighExtractorHeight;
            existingData.HighExtractorDepth = updateDto.HighExtractorDepth;
            existingData.PalletDelta = updateDto.PalletDelta;

            return existingData;
        }
    }
}