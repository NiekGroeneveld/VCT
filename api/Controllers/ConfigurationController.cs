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
        private readonly ITrayRepository _trayRepository;

        public ConfigurationController(IProductRepository productRepository, IConfigurationRepository configurationRepository, ITrayRepository trayRepository)
        {
            _productRepository = productRepository;
            _configurationRepository = configurationRepository;
            _trayRepository = trayRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var configurations = await _configurationRepository.GetAllAsync();
            return Ok(configurations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var configuration = await _configurationRepository.GetByIdAsync(id);
            if (configuration == null) return NotFound();

            return Ok(configuration);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int companyId, [FromBody] CreateConfigurationDTO configurationDto)
        {
            // TODO: Implement GetById for Company and GetByConfigurationType for ConfigurationTypeData
            Company? company = null; //Add GetbyId
            ConfigurationTypeData? configurationTypeData = null; //Add GetByConfigurationType
            
            if (company == null || configurationTypeData == null)
            {
                return BadRequest("Company or ConfigurationTypeData not found");
            }
            
            var configuration = configurationDto.ToConfigurationFromCreateDTO(configurationTypeData, company);
            await _configurationRepository.CreateAsync(configuration);
            return CreatedAtAction(nameof(GetById), new { id = configuration.Id }, configuration);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateConfigurationDTO configurationDto)
        {
            var configuration = await _configurationRepository.GetByIdAsync(id);
            if (configuration == null) return NotFound();

            var trayIds = configuration.Trays.Select(t => t.Id).ToList();
            var newTrayIds = configurationDto.Trays.Select(t => t.Id).ToList();
            if (!trayIds.SequenceEqual(newTrayIds))
            {
                throw new InvalidOperationException("Tray IDs do not match.");
            }
            List<Tray> updatedTrays = new List<Tray>();

            foreach (var UpdateTrayDto in configurationDto.Trays)
            {
                var products = await _productRepository.GetProductsByIdsAsync(UpdateTrayDto.Products.Select(p => p.Id).ToList());
                var tray = await _trayRepository.GetByIdAsync(UpdateTrayDto.Id);
                if (tray == null) return NotFound("At least one Tray Not Found while Updating Configuration");

                tray = UpdateTrayDto.ToTrayFromUpdateDTO(tray, products);
                updatedTrays.Add(tray);
            }

            configuration.Name = configurationDto.Name;
            configuration.Trays = updatedTrays;

            await _configurationRepository.UpdateAsync(configuration);
            return Ok(configuration.ToDTO());
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