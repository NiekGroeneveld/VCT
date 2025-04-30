using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.AccountDtos;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;

namespace api.Controllers
{
        [Route("api/account")]
        [ApiController]
        public class AccountController : ControllerBase
        {
            private readonly ApplicationDBContext _context;
            private readonly IAccountRepository _accountRepository;
            
            public AccountController(ApplicationDBContext context, IAccountRepository accountRepository)
            {
                _accountRepository = accountRepository;
                _context = context;
            }

            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                if(!ModelState.IsValid) 
                    {
                        return BadRequest();
                    }
                var account = await _accountRepository.GetAllAsync();
                var accountDto = account.Select(s => s.ToAccountDTO());
                return Ok(account);
            }

            [HttpGet("{id:int}")]
            public async Task<IActionResult> GetById([FromRoute] int id)
            {
                var account = await _accountRepository.GetByIdAsync(id);

                if(account == null)   {return NotFound();}

                return Ok(account.ToAccountDTO());
            }

            [HttpPost]
            public async Task<IActionResult> Create([FromBody] CreateAccountRequestDTO accountDTO)
            {
                var accountModel = accountDTO.ToAccountFromCreateDTO();
                await _accountRepository.CreateAsync(accountModel);
                return CreatedAtAction(nameof(GetById), new {id = accountModel.Id}, accountModel.ToAccountDTO());
            }

            [HttpPut]
            [Route("{id:int}")]
            public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateAccountRequestDTO updateDTO)
            {
                var accountModel = await _accountRepository.UpdateAsync(id, updateDTO);

                if(accountModel == null)    {return NotFound();}

                return Ok(accountModel.ToAccountDTO());
            }

            [HttpDelete]
            [Route("{id:int}")]
            public async Task<IActionResult> Delete([FromRoute] int id)
            {
                var accountModel = await _accountRepository.DeleteAsync(id);

                if(accountModel == null)    {return NotFound();}

                return NoContent(); 
            }


        }
}