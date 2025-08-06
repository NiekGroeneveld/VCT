using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.UserDtos;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using VCT.API.Models.Users;

namespace api.Mappers
{
    public static class UserMappers
    {
        public static UserDTO ToUserDTO(this User UserModel)
        {
            return new UserDTO
            {
                Id = UserModel.Id,
                Name = UserModel.Name,
                Clients = UserModel.UserClients.Select(ac => ac.Client).Where(c=> c != null).Select(c => c.ToClientDTO()).ToList(),
                Products = UserModel.UserProducts.Select(ap => ap.Product).Where(c => c != null).Select(p => p.ToProductDTO()).ToList()
            };
        }
    
        public static User ToUserFromCreateDTO(this CreateUserRequestDTO createUserRequestDTO)
        {
            return new User
            {
                Name = createUserRequestDTO.Name,
                Password = createUserRequestDTO.Password
            };
        }
    }

    
}