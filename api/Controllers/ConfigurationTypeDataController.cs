using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.ConfigurationTypeData;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/ConfigurationTypeData")]
    public class ConfigurationTypeDataController : ControllerBase
    {
        private readonly IConfigurationTypeDataRepository _ConfigurationTypeDataRepository;

        public ConfigurationTypeDataController(IConfigurationTypeDataRepository configurationTypeDataRepository)
        {
            _ConfigurationTypeDataRepository = configurationTypeDataRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ConfigTypeDataList = await _ConfigurationTypeDataRepository.GetAllAsync();
            return Ok(ConfigTypeDataList.Select(c => c.ToDTO()));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var configTypeData = await _ConfigurationTypeDataRepository.GetByIdAsync(id);
            if (configTypeData == null)
            {
                return NotFound();
            }
            return Ok(configTypeData.ToDTO());
        }

        [HttpGet("by-name/{name}")]
        public async Task<IActionResult> GetByName([FromRoute] string name)
        {
            var configTypeData = await _ConfigurationTypeDataRepository.GetByTypeNameAsync(name);
            if (configTypeData == null)
            {
                return NotFound();
            }
            return Ok(configTypeData.ToDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateConfigurationTypeDataDTO configurationTypeDataDTO)
        {
            var configTypeData = configurationTypeDataDTO.ToConfigurationTypeDataFromCreateDTO();
            await _ConfigurationTypeDataRepository.CreateAsync(configTypeData);
            return CreatedAtAction(nameof(GetById), new { id = configTypeData.Id }, configTypeData.ToDTO());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateConfigurationTypeDataDTO configurationTypeDataDTO)
        {
            if (configurationTypeDataDTO == null)
            {
                return BadRequest("Invalid request body");
            }

            var configTypeData = await _ConfigurationTypeDataRepository.GetByIdAsync(id);
            if (configTypeData == null)
            {
                return NotFound();
            }

            configurationTypeDataDTO.ToConfigurationTypeDataFromUpdateDTO(configTypeData);
            await _ConfigurationTypeDataRepository.UpdateAsync(configTypeData);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var configTypeData = await _ConfigurationTypeDataRepository.GetByIdAsync(id);
            if (configTypeData == null)
            {
                return NotFound();
            }

            await _ConfigurationTypeDataRepository.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var types = await _ConfigurationTypeDataRepository.GetTypesAsync();
            return Ok(types);
        }

    }
}