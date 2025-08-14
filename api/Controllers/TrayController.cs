using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Tray;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{

    [Route("api/controllers/companies/{companyId}/configurations/{configurationId}/trays")]
    public class TrayController : ControllerBase
    {
        private readonly ITrayInterface _trayRepo;
        public TrayController(ITrayInterface trayRepository)
        {
            _trayRepo = trayRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trays = await _trayRepo.GetAllAsync();
            return Ok(trays.Select(t => t.toDTO()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tray = await _trayRepo.GetByIdAsync(id);
            if (tray == null) return NotFound();

            return Ok(tray.toDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int companyId, [FromRoute] int configurationId, [FromBody] CreateTrayDTO createDTO)
        {
            var tray = createDTO.toTrayFromCreateDTO();
            await _trayRepo.CreateAsync(tray);
            return CreatedAtAction(nameof(GetById), new { id = tray.Id }, tray.toDTO());
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTrayDTO updateDTO)
        {
            var tray = await _trayRepo.GetByIdAsync(id);
            if (tray == null) return NotFound();

            tray = updateDTO.toTrayFromUpdateDTO(tray);
            await _trayRepo.UpdateAsync(tray);
            return Ok(tray.toDTO());
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