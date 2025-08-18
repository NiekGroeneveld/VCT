using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Company;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/companies")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepo;

        public CompanyController(ICompanyRepository companyRepo)
        {
            _companyRepo = companyRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var companies = await _companyRepo.GetAllAsync();
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

            var company = companyDto.ToCompanyFromCreateDTO();
            await _companyRepo.CreateAsync(company);
            return CreatedAtAction(nameof(GetById), new { id = company.Id }, company.ToDTO());
        }

        [HttpPut("{id}")]
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