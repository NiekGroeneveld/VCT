using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.ClientDtos;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

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
            public async Task<IActionResult> GetAll()
            {
                var clients = await _clientRepo.GetAllAsync();
                var clientDTO = clients.Select(c => c.ToClientDTO());
                return Ok(clients);
            }

            [HttpGet("{id:int}")]
            public async Task<IActionResult> GetById([FromRoute] int id)
            {
                var clientModel = await _clientRepo.GetByIdAsync(id);
                
                 if (clientModel == null) { return NotFound(); }

                var clientDTO = clientModel.ToClientDTO();
                return Ok(clientDTO);
            }

            [HttpPost("{accountId:int}")]
            public async Task<IActionResult> Create([FromRoute] int accountId, [FromBody] CreateClientRequestDTO clientDTO)
            {
                var clientModel = clientDTO.ToClientFromCreateDTO(accountId);
                
                if(!await _accountRepo.AccountExists(accountId)) 
                {
                    return BadRequest("Account does not exits");
                }
                
                await _clientRepo.CreateAsync(clientModel);
                return CreatedAtAction(nameof(GetById), new { id = clientModel.Id }, clientModel.ToClientDTO());
            }

    




        }
}