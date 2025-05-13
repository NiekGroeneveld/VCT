using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.ClientDtos;
using api.Interfaces;
using api.Mappers;
using api.QueryObjects;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
        [Route("api/client")]
        [ApiController]

        public class ClientController : ControllerBase
        {
            private readonly ApplicationDBContext _context;
            private readonly IClientRepository _clientRepo;
            private readonly IAccountRepository _accountRepo;

            public ClientController(ApplicationDBContext context, IAccountRepository accountRepository, IClientRepository clientRepository)
            {
                _accountRepo = accountRepository;
                _clientRepo = clientRepository;
                _context = context;
            }

            [HttpGet]
            public async Task<IActionResult> GetAll([FromQuery] ClientQueryObject query)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var clients = await _clientRepo.GetAllAsync(query);
                var clientDTO = clients.Select(c => c.ToClientDTO());
                return Ok(clientDTO);
            }

            [HttpGet("{id:int}")]
            public async Task<IActionResult> GetById([FromRoute] int id)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                
                var clientModel = await _clientRepo.GetByIdAsync(id);
                
                if (clientModel == null) { return NotFound(); }

                var clientDTO = clientModel.ToClientDTO();
                return Ok(clientDTO);
            }

            [HttpPost("{accountId:int}")]
            public async Task<IActionResult> Create([FromRoute] int accountId, [FromBody] CreateClientRequestDTO clientDTO)
            {
                if(!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var clientModel = clientDTO.ToClientFromCreateDTO();
                
                if(!await _accountRepo.AccountExists(accountId)) 
                {
                    return BadRequest("Account does not exits");
                }
                
                await _clientRepo.CreateAsync(clientModel);
                return CreatedAtAction(nameof(GetById), new { id = clientModel.Id }, clientModel.ToClientDTO());
            }

            [HttpPut("{id:int}")] 
            public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateClientRequestDTO updateDTO)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                
                var clientModel = await _clientRepo.UpdateAsync(id, updateDTO);

                if(clientModel == null)    {return NotFound();}

                return Ok(clientModel.ToClientDTO());
            }

            [HttpDelete("{id:int}")] 
            public async Task<IActionResult> Delete([FromRoute] int id)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var clientModel = await _clientRepo.DeleteAsync(id);

                if(clientModel == null)    {return NotFound("Client does not exist");}

                return Ok(clientModel.ToClientDTO());
            }
        }
}