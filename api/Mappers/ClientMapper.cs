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
                Products = clientModel.ClientProducts.Select(cp => cp.Product).Where(p => p != null).Select(p => p.ToProductDTO()).ToList(),
                Machines = clientModel.Machines
            };
        }

        
        //Non-complete this thing will get added to to an account or accounts later on.
        public static Client ToClientFromCreateDTO(this CreateClientRequestDTO createClientRequestDTO)
        {
            return new Client
            {
                Name = createClientRequestDTO.Name,
            };
        }
        
        public static Client ToClientFromUpdateDTO(this UpdateClientRequestDTO updateClientRequestDTO)
        {
            return new Client
            {
                Name = updateClientRequestDTO.Name
            };
        }
    }
}