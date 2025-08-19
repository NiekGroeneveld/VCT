using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    [Route("api/controllers/companies/{companyId}/configurations/{configId}/trays")]
    public class TrayController : ControllerBase
    {
        private readonly IConfigurationRepository _configurationRepo;
        private readonly ITrayRepository _trayRepo;
        private readonly IProductRepository _productRepo;
        public TrayController(IConfigurationRepository configurationRepository, ITrayRepository trayRepository, IProductRepository productRepository)
        {
            _configurationRepo = configurationRepository;
            _trayRepo = trayRepository;
            _productRepo = productRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trays = await _trayRepo.GetAllAsync();
            return Ok(trays.Select(t => t.ToDTO()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tray = await _trayRepo.GetByIdAsync(id);
            if (tray == null) return NotFound();

            return Ok(tray.ToDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int companyId, [FromRoute] int configId, [FromBody] CreateTrayDTO createDTO)
        {
            var configuration = await _configurationRepo.GetByIdAsync(configId);
            if (configuration == null) return NotFound("Configuration for Creating Tray Not found");

            var tray = createDTO.ToTrayFromCreateDTO(configuration);
            await _trayRepo.CreateAsync(tray);
            return CreatedAtAction(nameof(GetById), new { companyId = companyId, configId = configId, id = tray.Id }, tray.ToDTO());
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTrayDTO updateDTO)
        {
            var existingTray = await _trayRepo.GetByIdAsync(id);
            if (existingTray == null) return NotFound();

            existingTray = updateDTO.ToTrayFromUpdateDTO(existingTray);
            await _trayRepo.UpdateAsync(existingTray);
            return Ok(existingTray.ToDTO());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tray = await _trayRepo.GetByIdAsync(id);
            if (tray == null) return NotFound();

            await _trayRepo.DeleteAsync(id);
            return NoContent();
        }
    }
}