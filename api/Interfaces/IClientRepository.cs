using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VCT.API.Models.Clients;
using api.Dtos.ClientDtos;

namespace api.Interfaces
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllAsync();
        Task<Client?> GetByIdAsync(int id);

        Task<Client> CreateAsync(Client clientModel);
    }
}