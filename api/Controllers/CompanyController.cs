using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.DTOs.Company;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/companies")]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepo;
        private readonly UserManager<AppUser> _userManager;

        public CompanyController(ICompanyRepository companyRepo, UserManager<AppUser> userManager)
        {
            _companyRepo = companyRepo;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var companies = await _companyRepo.GetAllAsync();
            return Ok(companies.Select(c => c.ToDTO()));
        }

        [HttpGet("my-companies")]
        public async Task<IActionResult> GetForUser()
        {
            // Get the current authenticated user
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User not authenticated");
            }

            var companies = await _companyRepo.GetCompaniesForUserAsync(currentUserId);
            return Ok(companies.Select(c => c.ToDTO()));
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var company = await _companyRepo.GetByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(company.ToDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDTO companyDto)
        {
            if (companyDto == null) return BadRequest();

            // Get the current authenticated user
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User not authenticated");
            }

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
            {
                return BadRequest("Current user not found");
            }

            var company = companyDto.ToCompanyFromCreateDTO();
            company.CreatedAt = DateTime.UtcNow;
            
            // Add the current user to the company
            company.Users.Add(currentUser);

            await _companyRepo.CreateAsync(company);
            return CreatedAtAction(nameof(GetById), new { id = company.Id }, company.ToDTO());
        }        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompanyDTO companyDto)
        {
            if (companyDto == null) return BadRequest();

            var company = await _companyRepo.GetByIdAsync(id);
            if (company == null) return NotFound();

            var updatedCompany = companyDto.ToCompanyFromUpdateDTO(company);
            await _companyRepo.UpdateAsync(updatedCompany);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var company = await _companyRepo.GetByIdAsync(id);
            if (company == null) return NotFound();

            await _companyRepo.DeleteAsync(id);
            return NoContent();
        }
    }
}