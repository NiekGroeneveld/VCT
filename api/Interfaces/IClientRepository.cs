using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Clients;
using api.Dtos.ClientDtos;
using api.QueryObjects;

namespace api.Interfaces
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllAsync(ClientQueryObject query);
        Task<Client?> GetByIdAsync(int id);

        Task<Client> CreateAsync(Client clientModel);

        Task<Client?> UpdateAsync(int id, UpdateClientRequestDTO updateDTO);

        Task<Client?> DeleteAsync(int id);


        //Additional
        Task<bool> ClientExists(int id);
    }
}