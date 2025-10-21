using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;
using api.Models;

namespace api.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<Product?> UpdateAsync(Product product);
        Task<Product?> DeleteAsync(int id);

        //Additional Methods
        Task<List<Product>> GetProductsByIdsAsync(List<int> productIds);
        Task<List<Product>> GetProductsByCompanyIdAsync(int companyId, bool includePublics = false);
        Task<List<Product>> GetActiveProductsByCompanyIdAsync(int companyId, bool includePublics = false);
        Task<List<Product>> GetProductsInConfigurationAsync(int configurationId);
        Task<bool> SetProductToInActiveAsync(int productId);
        Task<bool> SetProductToActiveAsync(int productId);
        Task<bool> IsProductInUseAsync(int productId);
        
       
    }
}