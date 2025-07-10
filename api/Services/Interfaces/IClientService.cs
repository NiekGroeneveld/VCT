using VCT.API.Models.Clients;
using api.Dtos.ClientDtos;
using api.QueryObjects;

namespace VCT.API.Services.Interfaces
{
    public interface IClientService
    {
        Task<List<Client>> GetAllClientsAsync(ClientQueryObject query);
        Task<Client?> GetClientByIdAsync(int id);
        Task<Client> CreateClientAsync(int accountId, CreateClientRequestDTO clientDto);
        Task<Client?> UpdateClientAsync(int id, UpdateClientRequestDTO updateDto);
        Task<bool> DeleteClientAsync(int id);
        Task<bool> ClientExistsAsync(int id);
    }
}
