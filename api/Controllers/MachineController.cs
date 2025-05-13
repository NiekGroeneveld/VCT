using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.MachineDtos;
using api.Interfaces;
using api.Mappers;
using api.Repository;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/Machine")]
    [ApiController]
    public class MachineController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IMachineRepository _machineRepository;
        private readonly IClientRepository _clientRepository;
        public MachineController(ApplicationDBContext context, IMachineRepository machineRepository, IClientRepository clientRepository)
        {
            _context = context;
            _machineRepository = machineRepository;
            _clientRepository = clientRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
           
            var machines = await _machineRepository.GetAllAsync();
            var machineDTO = machines.Select(s => s.ToMachineDTO());
            return Ok(machineDTO);;
        }

        [HttpGet("{id:int}", Name = "GetMachine")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var machine = await _machineRepository.GetByIdAsync(id);

            if (machine == null) { return NotFound(); }

            return Ok(machine.ToMachineDTO());
        }

        [HttpPost("{clientId:int}")]
        public async Task<IActionResult> Create([FromRoute] int clientId, [FromBody] CreateMachineRequestDTO machineDTO)
        {  
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            
            if(!await _clientRepository.ClientExists(clientId)) {
                return BadRequest("Client does not exits");
            }
            
            var machineModel = machineDTO.ToMachineFromCreateDTO(clientId);

            Console.WriteLine($"Creating machine with ClientId: {machineModel.ClientId}");
            
            await _machineRepository.CreateAsync(machineModel);
            return CreatedAtAction(nameof(GetById), new { id = machineModel.Id }, machineModel.ToMachineDTO());
        }

        [HttpPut("{id:int}")] 
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateMachineRequestDTO updateDTO)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var machineModel = await _machineRepository.UpdateAsync(id, updateDTO);

            if(machineModel == null)    {return NotFound();}

            return Ok(machineModel.ToMachineDTO());
        }

        [HttpDelete("{id:int}")] 
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
             
            var machineModel = await _machineRepository.DeleteAsync(id);

            if(machineModel == null)    {return NotFound();}

            return Ok(machineModel.ToMachineDTO());
        }



    }
}