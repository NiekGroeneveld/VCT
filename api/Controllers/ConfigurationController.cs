using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.ConfigurationDtos;
using api.Interfaces;
using api.Mappers;
using api.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using VCT.API.Models.Enums;

namespace api.Controllers
{
    [Route("api/configuration")]
    [ApiController]
    
    public class ConfigurationController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IConfigurationRepository _ConfigurationRepo;
        private readonly IMachineRepository _MachineRepo;

        public ConfigurationController(ApplicationDBContext context, IConfigurationRepository ConfigurationRepo, IMachineRepository MachineRepo)
        {
            _context = context;
            _ConfigurationRepo = ConfigurationRepo;
            _MachineRepo = MachineRepo;
        }   

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var configurations = await _ConfigurationRepo.GetAllAsync();
            var configurationDTOs = configurations.Select(c => c.ToConfigurationDTO());
            return Ok(configurationDTOs);
        }


        [HttpGet("{id:int}")] 
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            
            var configuration = await _ConfigurationRepo.GetByIdAsync(id);
            
            if(configuration == null){
                return NotFound();
            }
            
            var configurationDTO = configuration.ToConfigurationDTO();
            return Ok(configurationDTO);
        }

        [HttpPost("{machineId:int}")] 
        public async Task<IActionResult> Create([FromRoute] int machineId, [FromBody] CreateConfigurationRequestDTO configurationDTO)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var machineExists = await _MachineRepo.MachineExists(machineId);
            if(!machineExists)
                return BadRequest("Machine does not exist");

            MachineType? machineType = await _MachineRepo.GetMachineTypeAsync(machineId);
            if(machineType == null)
                return BadRequest("Machine has no type");
            
            ConfigurationType configurationType = machineType.Value.ToConfigurationType();

            var configuration = configurationDTO.ToConfigurationFromCreateDTO(machineId, configurationType);
            await _ConfigurationRepo.CreateAsync(configuration);
            return CreatedAtAction(nameof(GetById), new { id = configuration.Id }, configuration.ToConfigurationDTO());
        }

        [HttpPut("{id:int}")] 
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateConfigurationRequestDTO configurationDTO)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var configuration = await _ConfigurationRepo.UpdateAsync(id, configurationDTO);
            if(configuration == null)
                return NotFound();
            
            return Ok(configuration.ToConfigurationDTO());
        }

        [HttpDelete("{id:int}")] 
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var configuration = await _ConfigurationRepo.DeleteAsync(id);
            if(configuration == null)
                return NotFound("Configuration does not exist");
            
            return Ok(configuration.ToConfigurationDTO());
        }
    }
}