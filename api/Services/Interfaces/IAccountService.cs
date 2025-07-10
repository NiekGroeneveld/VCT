using VCT.API.Models.Accounts;
using api.Dtos.AccountDtos;
using api.QueryObjects;

namespace VCT.API.Services.Interfaces
{
    public interface IAccountService
    {
        Task<List<Account>> GetAllAccountsAsync(AccountQueryObject query);
        Task<Account?> GetAccountByIdAsync(int id);
        Task<Account> CreateAccountAsync(CreateAccountRequestDTO accountDto);
        Task<Account?> UpdateAccountAsync(int id, UpdateAccountRequestDTO updateDto);
        Task<bool> DeleteAccountAsync(int id);
        Task<bool> AccountExistsAsync(int id);
    }
}
