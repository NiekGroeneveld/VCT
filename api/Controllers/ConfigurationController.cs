using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Configuration;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/companies/{companyId}/configurations")]
    public class ConfigurationController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IConfigurationRepository _configurationRepository;
        private readonly IConfigurationTypeDataRepository _configurationTypeDataRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly ITrayRepository _trayRepository;

        public ConfigurationController(IProductRepository productRepository, IConfigurationRepository configurationRepository, ICompanyRepository companyRepository, ITrayRepository trayRepository, IConfigurationTypeDataRepository configurationTypeDataRepository)
        {
            _productRepository = productRepository;
            _configurationRepository = configurationRepository;
            _companyRepository = companyRepository;
            _trayRepository = trayRepository;
            _configurationTypeDataRepository = configurationTypeDataRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var configurations = await _configurationRepository.GetAllAsync();
            return Ok(configurations.Select(c => c.ToDTO()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var configuration = await _configurationRepository.GetByIdAsync(id);
            if (configuration == null) return NotFound();

            return Ok(configuration.ToDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int companyId, [FromBody] CreateConfigurationDTO configurationDto)
        {
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
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var configuration = await _configurationRepository.GetByIdAsync(id);
            if (configuration == null) return NotFound("Configuration Not Found");

            await _configurationRepository.DeleteAsync(id);
            return NoContent();
        }

    }
}