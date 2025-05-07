
using api.Dtos.AccountDtos;
using api.QueryObjects;
using VCT.API.Models.Accounts;

namespace api.Interfaces
{
    public interface IAccountRepository
    {
        //Native
        Task<List<Account>> GetAllAsync(AccountQueryObject query);

        Task<Account?> GetByIdAsync(int id);    //FirstOrDefault CAN BE NULL
        Task<Account> CreateAsync(Account accountModel);

        Task<Account?> UpdateAsync(int id, UpdateAccountRequestDTO accountDto);

        Task<Account?> DeleteAsync(int id);

        
        
        //Additional
        Task<bool> AccountExists(int id);

    }
}