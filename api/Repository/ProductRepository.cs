using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.Product;
using api.Interfaces;
using api.Mappers;
using api.Migrations;
using api.Models;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDBContext _context;

        public ProductRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Product> CreateAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> DeleteAsync(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return product;
        }
        

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public Task<List<Product>> GetProductsByCompanyIdAsync(int companyId, bool includePublics = false)
        {
            var products = _context.Products
                .Include(p => p.Company)
                .Where(p => p.CompanyId == companyId);

            if (includePublics)
            {
                products.Union(_context.Products.Where(p => p.IsPublic));
            }
            return products.ToListAsync();
        }

        public async Task<List<Product>> GetProductsByIdsAsync(List<int> productIds)
        {
            return await _context.Products
                .Include(p => p.Company)
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();
        }

        public Task<bool> SetProductToInActiveAsync(int productId)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null) return Task.FromResult(false);

            product.IsActive = false;
            _context.SaveChanges();
            return Task.FromResult(true);
        }

        public Task<bool> SetProductToActiveAsync(int productId)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null) return Task.FromResult(false);

            product.IsActive = true;
            _context.SaveChanges();
            return Task.FromResult(true);
        }

        public async Task<Product?> UpdateAsync(Product product)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == product.Id);
            if (existingProduct == null) return null;

            existingProduct = product;
            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public Task<bool> IsProductInUseAsync(int productId)
        {
            var product = _context.Products
                .Include(p => p.TrayProducts)
                .FirstOrDefault(p => p.Id == productId);
            if (product == null) return Task.FromResult(false);
            
            return Task.FromResult(product.TrayProducts.Count > 0);
        }

        public Task<List<Product>> GetActiveProductsByCompanyIdAsync(int companyId, bool includePublics = false)
        {
            var products = _context.Products
                .Include(p => p.Company)
                .Where(p => p.CompanyId == companyId && p.IsActive);

            if (includePublics)
            {
                products = products.Union(_context.Products.Where(p => p.IsPublic && p.IsActive));
            }

            return products.ToListAsync();
        }

        public Task<List<Product>> GetProductsInConfigurationAsync(int configurationId )
        {
            var configuration = _context.Configurations
                .Include(c => c.Trays)
                .ThenInclude(t => t.TrayProducts)
                .ThenInclude(tp => tp.Product)
                .FirstOrDefault(c => c.Id == configurationId);

            if (configuration == null)
            {
                return Task.FromResult(new List<Product>());
            }
            var products = configuration.Trays
                .SelectMany(t => t.TrayProducts)
                .Select(tp => tp.Product)
                .Distinct()
                .ToList();

            products = products.Where(p => p.IsActive).ToList();

            return Task.FromResult(products);
        }
    }

}
