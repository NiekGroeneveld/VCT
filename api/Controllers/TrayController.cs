using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Mappers;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using api.Repository;

namespace api.Controllers
{
    [Route("api/Tray")]
    [ApiController]
    public class TrayController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly ITrayRepository _trayRepository;
        private readonly IConfigurationRepository _configurationRepository;
        public TrayController(ApplicationDBContext context, ITrayRepository trayRepository, IConfigurationRepository configurationRepository)
        {
            _trayRepository = trayRepository;
            _context = context;
            _configurationRepository = configurationRepository;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var trays = await _trayRepository.GetAllAsync();
            var trayDTO = trays.Select(s => s.ToTrayDTO());
            return Ok(trays);
        }

        [HttpGet("GetById/{id}")] 
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tray = await _trayRepository.GetByIdAsync(id);
            var trayDTO = tray.ToTrayDTO();
            return Ok(trayDTO);
        }

        [HttpPost("CreateTrayInConfig/{configurationId:int}")] 
        public async Task<IActionResult> Create([FromRoute] int configurationId)
        {
            throw new NotImplementedException();  
        }

    }
}