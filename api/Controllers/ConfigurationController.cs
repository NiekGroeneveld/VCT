using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.DTOs.Configuration;
using api.Interfaces;
using api.Mappers;
using api.Mappers.ConfigurationAreaMappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/companies/{companyId}/configurations")]
    [Authorize]
    public class ConfigurationController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IConfigurationRepository _configurationRepository;
        private readonly IConfigurationTypeDataRepository _configurationTypeDataRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly ITrayRepository _trayRepository;
        private readonly UserManager<AppUser> _userManager;
    

        public ConfigurationController(IProductRepository productRepository, IConfigurationRepository configurationRepository, ICompanyRepository companyRepository, ITrayRepository trayRepository, IConfigurationTypeDataRepository configurationTypeDataRepository, UserManager<AppUser> userManager)
        {
            _productRepository = productRepository;
            _configurationRepository = configurationRepository;
            _companyRepository = companyRepository;
            _trayRepository = trayRepository;
            _configurationTypeDataRepository = configurationTypeDataRepository;
            _userManager = userManager;
        }

        private async Task<bool> UserBelongsToCompany(int companyId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId)) return false;

            var userCompanies = await _companyRepository.GetCompaniesForUserAsync(currentUserId);
            return userCompanies.Any(c => c.Id == companyId);
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var configurations = await _configurationRepository.GetAllAsync();
            // Filter configurations to only include those for this company
            return Ok(configurations.Select(c => c.ToDTO()));
        }

        [HttpGet("getCompanyConfigurations")]
        public async Task<IActionResult> GetAllForCompany([FromRoute] int companyId)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to configurations for this company");
            }
            //Warning, this does not return full configurations, just the names and ids for dropdowns

            var configurations = await _configurationRepository.GetConfigurationsNamesIdsForCompanyAsync(companyId);
            // Filter configurations to only include those for this company
            return Ok(configurations.Select(c => c.ToNameIdDTO()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int companyId, int id)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to configurations for this company");
            }

            var configuration = await _configurationRepository.GetByIdAsync(id);
            if (configuration == null) return NotFound();

            // Verify the configuration belongs to the specified company
            if (configuration.CompanyId != companyId)
            {
                return NotFound("Configuration not found for this company");
            }

            return Ok(configuration.ToDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int companyId, [FromBody] CreateConfigurationDTO configurationDto)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to create configurations for this company");
            }

            // TODO: Implement GetById for Company and GetByConfigurationType for ConfigurationTypeData
            Company? company = await _companyRepository.GetByIdAsync(companyId);
            ConfigurationTypeData? configurationTypeData = await _configurationTypeDataRepository.GetByTypeNameAsync(configurationDto.ConfigurationType);

            if (company == null)
            {
                return BadRequest($"Company with ID {companyId} not found");
            }

            if (configurationTypeData == null)
            {
                return BadRequest($"ConfigurationTypeData with type '{configurationDto.ConfigurationType}' not found. Available types can be retrieved from /api/ConfigurationTypeData");
            }
           
            var configuration = configurationDto.ToConfigurationFromCreateDTO(configurationTypeData, company);


            await _configurationRepository.CreateAsync(configuration);
            return CreatedAtAction(nameof(GetById), new { companyId = companyId, id = configuration.Id }, configuration.ToDTO());
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int companyId, [FromRoute] int id)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to delete configurations for this company");
            }

            var configuration = await _configurationRepository.GetByIdAsync(id);
            if (configuration == null) return NotFound("Configuration Not Found");

            // Verify the configuration belongs to the specified company
            if (configuration.CompanyId != companyId)
            {
                return NotFound("Configuration not found for this company");
            }

            await _configurationRepository.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("LoadConfigurationArea/{id}")]
        public async Task<IActionResult> LoadConfigurationArea([FromRoute] int companyId, int id)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to load configurations for this company");
            }

            var configuration = await _configurationRepository.GetByIdAsync(id);
            if (configuration == null) return NotFound("Configuration Not Found");

            // Verify the configuration belongs to the specified company
            if (configuration.CompanyId != companyId)
            {
                return NotFound("Configuration not found for this company");
            }

            var configurationAreaDTO = configuration.ToConfigurationAreaDTO();

            return Ok(configurationAreaDTO);
        }
    }
}