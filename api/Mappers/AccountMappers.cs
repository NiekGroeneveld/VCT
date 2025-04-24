using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Account;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using VCT.API.Models.Accounts;

namespace api.Mappers
{
    public static class AccountMappers
    {
        public static AccountDTO ToAccountDTO(this Account accountModel)
        {
            return new AccountDTO
            {
                Id = accountModel.Id,
                Name = accountModel.Name,
                Clients = accountModel.Clients,
                Products = accountModel.Products.Select(p => p.ToProductDTO()).ToList()
            };
        }
    
        public static Account ToAccountFromCreateDTO(this CreateAccountRequestDTO createAccountRequestDTO)
        {
            return new Account
            {
                Name = createAccountRequestDTO.Name,
                Password = createAccountRequestDTO.Password
            };
        }
    }

    
}