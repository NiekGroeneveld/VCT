using VCT.API.Models.Products;
using api.Dtos.ProductDtos;

namespace VCT.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(int accountId, CreateProductDTO productDto);
        Task<Product?> UpdateProductAsync(int id, UpdateProductRequestDTO updateDto);
        Task<bool> DeleteProductAsync(int id);
        Task<List<Product>> GetProductsByAccountAsync(int accountId);
        Task<List<Product>> GetProductsByClientAsync(int clientId);
    }
}
