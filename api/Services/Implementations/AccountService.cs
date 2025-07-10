using VCT.API.Models.Accounts;
using VCT.API.Services.Interfaces;
using api.Dtos.AccountDtos;
using api.Interfaces;
using api.Mappers;
using api.QueryObjects;

namespace VCT.API.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly ILogger<AccountService> _logger;

        public AccountService(IAccountRepository accountRepository, ILogger<AccountService> logger)
        {
            _accountRepository = accountRepository;
            _logger = logger;
        }

        public async Task<List<Account>> GetAllAccountsAsync(AccountQueryObject query)
        {
            try
            {
                _logger.LogInformation("Retrieving all accounts with query parameters");
                return await _accountRepository.GetAllAsync(query);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all accounts");
                throw new InvalidOperationException("Failed to retrieve accounts", ex);
            }
        }

        public async Task<Account?> GetAccountByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving account with ID: {AccountId}", id);
                
                if (id <= 0)
                {
                    _logger.LogWarning("Invalid account ID provided: {AccountId}", id);
                    return null;
                }

                return await _accountRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving account with ID: {AccountId}", id);
                throw new InvalidOperationException($"Failed to retrieve account with ID: {id}", ex);
            }
        }

        public async Task<Account> CreateAccountAsync(CreateAccountRequestDTO accountDto)
        {
            try
            {
                _logger.LogInformation("Creating new account with name: {AccountName}", accountDto.Name);
                
                // Business logic validation
                if (string.IsNullOrWhiteSpace(accountDto.Name))
                {
                    throw new ArgumentException("Account name cannot be empty");
                }

                if (string.IsNullOrWhiteSpace(accountDto.Password))
                {
                    throw new ArgumentException("Password cannot be empty");
                }

                var accountModel = accountDto.ToAccountFromCreateDTO();
                var createdAccount = await _accountRepository.CreateAsync(accountModel);
                
                _logger.LogInformation("Successfully created account with ID: {AccountId}", createdAccount.Id);
                return createdAccount;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating account with name: {AccountName}", accountDto.Name);
                throw new InvalidOperationException("Failed to create account", ex);
            }
        }

        public async Task<Account?> UpdateAccountAsync(int id, UpdateAccountRequestDTO updateDto)
        {
            try
            {
                _logger.LogInformation("Updating account with ID: {AccountId}", id);
                
                if (id <= 0)
                {
                    _logger.LogWarning("Invalid account ID provided for update: {AccountId}", id);
                    return null;
                }

                if (string.IsNullOrWhiteSpace(updateDto.Name))
                {
                    throw new ArgumentException("Account name cannot be empty");
                }

                var updatedAccount = await _accountRepository.UpdateAsync(id, updateDto);
                
                if (updatedAccount != null)
                {
                    _logger.LogInformation("Successfully updated account with ID: {AccountId}", id);
                }
                else
                {
                    _logger.LogWarning("Account with ID: {AccountId} not found for update", id);
                }

                return updatedAccount;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating account with ID: {AccountId}", id);
                throw new InvalidOperationException($"Failed to update account with ID: {id}", ex);
            }
        }

        public async Task<bool> DeleteAccountAsync(int id)
        {
            try
            {
                _logger.LogInformation("Deleting account with ID: {AccountId}", id);
                
                if (id <= 0)
                {
                    _logger.LogWarning("Invalid account ID provided for deletion: {AccountId}", id);
                    return false;
                }

                var deletedAccount = await _accountRepository.DeleteAsync(id);
                var success = deletedAccount != null;
                
                if (success)
                {
                    _logger.LogInformation("Successfully deleted account with ID: {AccountId}", id);
                }
                else
                {
                    _logger.LogWarning("Account with ID: {AccountId} not found for deletion", id);
                }

                return success;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting account with ID: {AccountId}", id);
                throw new InvalidOperationException($"Failed to delete account with ID: {id}", ex);
            }
        }

        public async Task<bool> AccountExistsAsync(int id)
        {
            try
            {
                if (id <= 0) return false;
                return await _accountRepository.AccountExists(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if account exists with ID: {AccountId}", id);
                throw new InvalidOperationException($"Failed to check account existence with ID: {id}", ex);
            }
        }
    }
}
