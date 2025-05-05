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
        public static ClientDto ToClientDTO(this Client clientModel)
        {
            return new ClientDto
            {
                Id = clientModel.Id,
                Name = clientModel.Name,
                Products = clientModel.Products,
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
        
    }
}