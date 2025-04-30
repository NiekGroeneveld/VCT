using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Products;

namespace api.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDBContext  _context;
        public ProductRepository(ApplicationDBContext  context)
        {
           _context = context; 
        }

        public async Task<Product> CreateAsync(Product productModel)
        {
            await _context.Products.AddAsync(productModel);
            await _context.SaveChangesAsync();
            return productModel;
        }

        public async Task<Product?> DeleteAsync(int id)
        {
            var productModel = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if(productModel == null)    
            {
                return null;
            }

            _context.Products.Remove(productModel); ///Not async!
            await _context.SaveChangesAsync();
            return productModel;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> UpdateAsync(int id, Product productModel)
        {
            var existingProduct = await _context.Products.FindAsync(id);

            if(existingProduct == null)    {return null;}

            existingProduct.Name = productModel.Name;
            existingProduct.Height = productModel.Height;
            existingProduct.Width = productModel.Width;
            existingProduct.Depth = productModel.Depth;
            existingProduct.Stable = productModel.Stable;

            await _context.SaveChangesAsync();
            return existingProduct;
        }
    }
}