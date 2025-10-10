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


            // 0-based index; ensure no duplicate index exists
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

        [HttpDelete]
        [Route("removeProductFromTray/{trayId}/{positionOnTray}")]
        public async Task<IActionResult> RemoveProductFromTray(int companyId, int configurationId, int trayId, int positionOnTray)
        {
            var company = await _companyRepo.GetByIdAsync(companyId);
            if (company == null) return NotFound("Company not found");

            var configuration = await _configurationRepo.GetByIdAsync(configurationId);
            if (configuration == null) return NotFound("Configuration not found");

            var tray = await _trayRepo.GetByIdAsync(trayId);
            if (tray == null) return NotFound("Tray not found");
            if (tray.Configuration.Id != configurationId) return BadRequest("Tray does not belong to the specified configuration");

            var trayProduct = tray.TrayProducts.FirstOrDefault(tp => tp.OnTrayIndex == positionOnTray);
            if (trayProduct == null)
            {
                return NotFound($"No product found at position {positionOnTray} on tray {trayId}.");
            }

            tray.TrayProducts.Remove(trayProduct);
            // Persist the change so subsequent GETs reflect the removal
            await _trayRepo.UpdateAsync(tray);

            var ProductInUse = await _productRepo.IsProductInUseAsync(trayProduct.ProductId);
            if (!ProductInUse)
            {
                // Product is not in use anywhere else; permanently delete it
                await _productRepo.DeleteAsync(trayProduct.ProductId);
                // Optionally, log this action or notify relevant parties
            }

            if (!TrayProductsIndicesAreValid(tray))
                {
                    return BadRequest("TrayProduct indices are not valid after removal.");
                }

            return Ok(tray.ToConfigurationAreaTrayDTO(configuration.ConfigurationTypeData));
        }

        [HttpPut]
        [Route("moveProductBetweenTrays/{fromTrayId}/{toTrayId}/{OldIndex}")]
        public async Task<IActionResult> MoveProductBetweenTrays(int companyId, int configurationId, int fromTrayId, int toTrayId, int OldIndex)
        {
            var company = await _companyRepo.GetByIdAsync(companyId);
            if (company == null) return NotFound("Company not found");

            var configuration = await _configurationRepo.GetByIdAsync(configurationId);
            if (configuration == null) return NotFound("Configuration not found");

            var fromTray = await _trayRepo.GetByIdAsync(fromTrayId);
            if (fromTray == null) return NotFound("Source Tray not found");
            if (fromTray.Configuration.Id != configurationId) return BadRequest("Source Tray does not belong to the specified configuration");

            var toTray = await _trayRepo.GetByIdAsync(toTrayId);
            if (toTray == null) return NotFound("Destination Tray not found");
            if (toTray.Configuration.Id != configurationId) return BadRequest("Destination Tray does not belong to the specified configuration");

            var trayProduct = fromTray.TrayProducts.FirstOrDefault(tp => tp.OnTrayIndex == OldIndex);
            if (trayProduct == null)
            {
                return NotFound($"No product found at position {OldIndex} on tray {fromTrayId}.");
            }

            // Remove from source tray
            fromTray.TrayProducts.Remove(trayProduct);

            // Add to destination tray at the end
            int newIndex = toTray.TrayProducts.Count > 0 ? toTray.TrayProducts.Max(tp => tp.OnTrayIndex) + 1 : 0;
            trayProduct.OnTrayIndex = newIndex;
            trayProduct.Tray = toTray; // Update the Tray reference
            toTray.TrayProducts.Add(trayProduct);

            // Persist changes
            await _trayRepo.UpdateAsync(fromTray);
            await _trayRepo.UpdateAsync(toTray);

            if (!TrayProductsIndicesAreValid(fromTray) || !TrayProductsIndicesAreValid(toTray))
            {
                return BadRequest("TrayProduct indices are not valid after moving product.");
            }

            return Ok(new
            {
                FromTray = fromTray.ToConfigurationAreaTrayDTO(configuration.ConfigurationTypeData),
                ToTray = toTray.ToConfigurationAreaTrayDTO(configuration.ConfigurationTypeData)
            });
        }

        [HttpPut]
        [Route("updateProductPositionInTray/{trayId}/{oldIndex}/{newIndex}")]
        public async Task<IActionResult> UpdateProductPositionInTray(int companyId, int configurationId, int trayId, int oldIndex, int newIndex)
        {
            var company = await _companyRepo.GetByIdAsync(companyId);
            if (company == null) return NotFound("Company not found");

            var configuration = await _configurationRepo.GetByIdAsync(configurationId);
            if (configuration == null) return NotFound("Configuration not found");

            var tray = await _trayRepo.GetByIdAsync(trayId);
            if (tray == null) return NotFound("Tray not found");
            if (tray.Configuration.Id != configurationId) return BadRequest("Tray does not belong to the specified configuration");

            // Bounds: 0..Count-1
            int count = tray.TrayProducts.Count;
            if (oldIndex < 0 || oldIndex >= count || newIndex < 0 || newIndex >= count)
            {
                return BadRequest($"Indices must be between 0 and {count - 1}.");
            }

            var ok = await _trayRepo.ReorderWithinTrayAsync(trayId, oldIndex, newIndex);
            if (!ok)
            {
                return BadRequest("Reorder failed.");
            }

            // Reload tray to reflect DB state using a fresh, untracked query (raw SQL bypassed EF tracking)
            tray = await _trayRepo.GetByIdFreshAsync(trayId);
            if (tray == null)
                return NotFound("Tray not found after reorder.");

            if (!TrayProductsIndicesAreValid(tray))
            {
                return BadRequest("TrayProduct indices are not valid after reordering.");
            }

            return Ok(tray.ToConfigurationAreaTrayDTO(configuration.ConfigurationTypeData));

        }



        private bool TrayProductsIndicesAreValid(Models.Tray tray)
        {
            var indices = tray.TrayProducts.Select(tp => tp.OnTrayIndex).ToList();
            // 0-based contiguous: 0..Count-1
            for (int i = 0; i < indices.Count; i++)
            {
                if (!indices.Contains(i)) return false;
            }
            return true;
        }

    }
}