using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.AccountDtos;
using api.Dtos.ProductDtos;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace api.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly IAccountRepository _accountRepo;

        
        public ProductController(IProductRepository productRepo, IAccountRepository accountRepo)
        {
            _productRepo = productRepo;
            _accountRepo = accountRepo;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
           
           var product = await _productRepo.GetAllAsync();
           var productDTO = product.Select(s => s.ToProductDTO());
           return Ok(productDTO);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = await _productRepo.GetByIdAsync(id);

            if(product == null)   {return NotFound();}

            return Ok(product.ToProductDTO());
        }

        [HttpPost("{accountId:int}")]
        public async Task<IActionResult> Create([FromRoute] int accountId, [FromBody] CreateProductDTO productDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            if(!await _accountRepo.AccountExists(accountId)) 
            {
                return BadRequest("Account does not exits");
            }
            var productModel = productDTO.ToProductFromCreateDTO(accountId);
            await _productRepo.CreateAsync(productModel);
            return CreatedAtAction(nameof(GetById), new {id = productModel.Id}, productModel.ToProductDTO());
        }

        [HttpPut]
        [Route("{id:int}")] 
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductRequestDTO updateDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = await _productRepo.UpdateAsync(id, updateDTO.ToProductFromUpdateDTO());

            if(product == null)    {return NotFound();}

            return Ok(product.ToProductDTO());
        }

        [HttpDelete]
        [Route("{id:int}")] 
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var productModel = await _productRepo.DeleteAsync(id);

            if(productModel == null)    
            {
                return NotFound("Product does not exist");
            }

            return Ok(productModel);
        }


    }
}