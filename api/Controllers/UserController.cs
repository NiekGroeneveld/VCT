using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.UserDtos;
using api.Interfaces;
using api.Mappers;
using api.QueryObjects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;

namespace api.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IUserRepository _UserRepository;

        public UserController(ApplicationDBContext context, IUserRepository UserRepository)
        {
            _UserRepository = UserRepository;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] UserQueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var User = await _UserRepository.GetAllAsync(query);
            var UserDTO = User.Select(s => s.ToUserDTO());
            return Ok(UserDTO);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); 
            
            var User = await _UserRepository.GetByIdAsync(id);

            if (User == null) { return NotFound(); }

            return Ok(User.ToUserDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequestDTO UserDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var UserModel = UserDTO.ToUserFromCreateDTO();
            await _UserRepository.CreateAsync(UserModel);
            return CreatedAtAction(nameof(GetById), new { id = UserModel.Id }, UserModel.ToUserDTO());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateUserRequestDTO updateDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var UserModel = await _UserRepository.UpdateAsync(id, updateDTO);

            if (UserModel == null) { return NotFound(); }

            return Ok(UserModel.ToUserDTO());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var UserModel = await _UserRepository.DeleteAsync(id);

            if (UserModel == null) { return NotFound(); }

            return NoContent();
        }


    }
}