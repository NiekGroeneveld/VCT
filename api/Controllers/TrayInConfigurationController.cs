using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/companies/{companyId}/configuration/{configurationId}/TrayInConfiguration")]
    public class TrayInConfigurationController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepo;
        private readonly IConfigurationRepository _configurationRepo;
        private readonly ITrayRepository _trayRepo;
        private readonly IProductRepository _productRepo;
        public TrayInConfigurationController(IConfigurationRepository configurationRepository, ITrayRepository trayRepository, IProductRepository productRepository, ICompanyRepository companyRepository)
        {
            _configurationRepo = configurationRepository;
            _trayRepo = trayRepository;
            _productRepo = productRepository;
            _companyRepo = companyRepository;
        }

        [HttpPut]
        [Route("addTrayToConfiguration/{trayPosition}")]
        public async Task<IActionResult> AddTrayToConfiguration([FromRoute] int companyId, [FromRoute] int configurationId, [FromRoute] int trayPosition)
        {
            var company = await _configurationRepo.GetByIdAsync(companyId);
            if (company == null) return NotFound("Company not found");

            var configuration = await _configurationRepo.GetByIdAsync(configurationId);
            if (configuration == null) return NotFound("Configuration not found");

            var tray = new Models.Tray
            {
                TrayPosition = trayPosition,
                Configuration = configuration
            };
            await _trayRepo.CreateAsync(tray);


            configuration.Trays.Add(tray);
            await _configurationRepo.UpdateAsync(configuration);
            return Ok(tray.ToDTO());
        }

        [HttpPut]
        [Route("removeTrayFromConfiguration/{trayId}")]
        public async Task<IActionResult> RemoveTrayFromConfiguration([FromRoute] int companyId, [FromRoute] int configurationId, [FromRoute] int trayId)
        {
            var company = await _companyRepo.GetByIdAsync(companyId);
            if (company == null) return NotFound("Company not found");

            var configuration = await _configurationRepo.GetByIdAsync(configurationId);
            if (configuration == null) return NotFound("Configuration not found");

            var tray = await _trayRepo.GetByIdAsync(trayId);
            if (tray == null) return NotFound("Tray not found");

            if (tray.Configuration.Id != configuration.Id)
            {
                return BadRequest("Tray does not belong to the specified configuration");
            }

            await _trayRepo.DeleteAsync(tray.Id);
            return NoContent();
        }

        [HttpPut]
        [Route("updateTrayPosition/{trayId}/{newPosition}")]
        public async Task<IActionResult> UpdateTrayPosition([FromRoute] int companyId, [FromRoute] int configurationId, [FromRoute] int trayId, [FromRoute] int newPosition)
        {
            var company = await _companyRepo.GetByIdAsync(companyId);
            if (company == null) return NotFound("Company not found");

            var configuration = await _configurationRepo.GetByIdAsync(configurationId);
            if (configuration == null) return NotFound("Configuration not found");

            var tray = await _trayRepo.GetByIdAsync(trayId);
            if (tray == null) return NotFound("Tray not found");

            if (tray.Configuration.Id != configuration.Id)
            {
                return BadRequest("Tray does not belong to the specified configuration");
            }

            tray.TrayPosition = newPosition;
            var updatedTray = await _trayRepo.UpdateAsync(tray);
            if (updatedTray == null) return StatusCode(500, "Error updating tray position");

            return Ok(updatedTray.ToDTO());
        }

    }
}