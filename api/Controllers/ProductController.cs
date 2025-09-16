using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.Product;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/companies/{companyId}/products")]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly ICompanyRepository _companyRepo;
        private readonly UserManager<AppUser> _userManager;

        public ProductController(IProductRepository productRepository, ICompanyRepository companyRepository, UserManager<AppUser> userManager)
        {
            _productRepo = productRepository;
            _companyRepo = companyRepository;
            _userManager = userManager;
        }

        private async Task<bool> UserBelongsToCompany(int companyId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId)) return false;
            
            var userCompanies = await _companyRepo.GetCompaniesForUserAsync(currentUserId);
            return userCompanies.Any(c => c.Id == companyId);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromRoute] int companyId)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to products for this company");
            }

            var products = await _productRepo.GetAllAsync();
            return Ok(products.Select(p => p.ToDTO()));
        }

        [HttpGet("getCompanyProducts/{usePublics?}")]
        public async Task<IActionResult> GetAllForCompany([FromRoute] int companyId, [FromRoute] bool usePublics)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to products for this company");
            }

            var products = await _productRepo.GetProductsByCompanyIdAsync(companyId);
            return Ok(products.Select(p => p.ToDTO()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int companyId, int id)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to products for this company");
            }

            var product = await _productRepo.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Verify the product belongs to the specified company
            if (product.CompanyId != companyId)
            {
                return NotFound("Product not found for this company");
            }

            return Ok(product.ToDTO());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromRoute] int companyId, [FromBody] CreateProductDTO productDTO)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to create products for this company");
            }

            var productModel = productDTO.toProductFromCreateDTO();
            
            // Ensure the product is associated with the correct company
            productModel.CompanyId = companyId;
            
            var product = await _productRepo.CreateAsync(productModel);
            return CreatedAtAction(nameof(GetById), new { companyId = companyId, id = productModel.Id }, productModel.ToDTO());
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int companyId, [FromRoute] int id, [FromBody] UpdateProductDTO updateDTO)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to update products for this company");
            }

            var product = await _productRepo.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Verify the product belongs to the specified company
            if (product.CompanyId != companyId)
            {
                return NotFound("Product not found for this company");
            }

            product = updateDTO.toProductFromUpdateDTO(product);
            await _productRepo.UpdateAsync(product);
            return Ok(product.ToDTO());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int companyId, [FromRoute] int id)
        {
            // Check if user belongs to the company
            if (!await UserBelongsToCompany(companyId))
            {
                return Forbid("You don't have access to delete products for this company");
            }

            var product = await _productRepo.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Verify the product belongs to the specified company
            if (product.CompanyId != companyId)
            {
                return NotFound("Product not found for this company");
            }

            await _productRepo.DeleteAsync(id);
            return NoContent();
        }
    }
}