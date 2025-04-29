
using api.Dtos.AccountDtos;
using VCT.API.Models.Accounts;

namespace api.Interfaces
{
    public interface IAccountRepository
    {
        Task<List<Account>> GetAllAsync();

        Task<Account?> GetByIdAsync(int id);    //FirstOrDefault CAN BE NULL
        Task<Account> CreateAsync(Account accountModel);

        Task<Account?> UpdateAsync(int id, UpdateAccountRequestDTO accountDto);

        Task<Account?> DeleteAsync(int id);

        Task<bool> AccountExists(int id);

    }
}