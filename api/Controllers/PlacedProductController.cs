using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Mappers.ConfigurationAreaMappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/companies/{companyId}/configuration/{configurationId}/placedProduct")]
    public class PlacedProductController : ControllerBase
    {

        private readonly ICompanyRepository _companyRepo;
        private readonly IConfigurationRepository _configurationRepo;
        private readonly ITrayRepository _trayRepo;
        private readonly IProductRepository _productRepo;
        public PlacedProductController(IConfigurationRepository configurationRepository, ITrayRepository trayRepository, IProductRepository productRepository, ICompanyRepository companyRepository)
        {
            _configurationRepo = configurationRepository;
            _trayRepo = trayRepository;
            _productRepo = productRepository;
            _companyRepo = companyRepository;
        }

        [HttpPut]
        [Route("addProductToTray/{trayId}/{productId}/{positionOnTray}")]

        public async Task<IActionResult> AddProductToTray(int companyId, int configurationId, int trayId, int productId, int positionOnTray)
        {
            var company = await _companyRepo.GetByIdAsync(companyId);
            if (company == null) return NotFound("Company not found");

            var configuration = await _configurationRepo.GetByIdAsync(configurationId);
            if (configuration == null) return NotFound("Configuration not found");

            var tray = await _trayRepo.GetByIdAsync(trayId);
            if (tray == null) return NotFound("Tray not found");
            if (tray.Configuration.Id != configurationId) return BadRequest("Tray does not belong to the specified configuration");

            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null) return NotFound("Product not found");

            if (tray.TrayProducts.Any(tp => tp.OnTrayIndex == positionOnTray))
            {
                return BadRequest($"Position {positionOnTray} on tray {trayId} is already occupied.");
            }

            tray.TrayProducts.Add(new Models.TrayProduct
            {
                Tray = tray,
                Product = product,
                OnTrayIndex = positionOnTray
            });
            // Persist the change so subsequent GETs include the product
            await _trayRepo.UpdateAsync(tray);

            return Ok(tray.ToConfigurationAreaTrayDTO(configuration.ConfigurationTypeData));
        }

    }
}