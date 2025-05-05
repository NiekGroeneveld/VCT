using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ClientDtos;
using VCT.API.Models.Clients;

namespace api.Mappers
{
    public static class ClientMapper
    {
        public static ClientDTO ToClientDTO(this Client clientModel)
        {
            return new ClientDTO
            {
                Id = clientModel.Id,
                Name = clientModel.Name,
                Products = clientModel.Products.Select(p => p.ToProductDTO()).ToList(),
                Machines = clientModel.Machines
            };
        }

        public static Client ToClientFromCreateDTO(this CreateClientRequestDTO createClientRequestDTO, int accountId)
        {
            return new Client
            {
                Name = createClientRequestDTO.Name,
                AccountId = accountId
            };
        }
        
        public static Client ToClientFromUpdateDTO(this UpdateClientRequestDTO updateClientRequestDTO)
        {
            return new Client
            {
                Name = updateClientRequestDTO.Name,
                Products = updateClientRequestDTO.Products,
                Machines = updateClientRequestDTO.Machines
            };
        }
    }
}