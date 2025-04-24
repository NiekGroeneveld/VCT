using api.Data;
using api.Dtos.Account;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Accounts;

namespace api.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDBContext _context;
        public AccountRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Account> CreateAsync(Account accountModel)
        {
            await _context.Accounts.AddAsync(accountModel);
            await _context.SaveChangesAsync();
            return accountModel;
        }

        public async Task<Account?> DeleteAsync(int id)
        {
            var stockModel = await _context.Accounts.FirstOrDefaultAsync(x => x.Id == id);

            if(stockModel == null)    {return null;}

            _context.Accounts.Remove(stockModel); ///Not async!
            await _context.SaveChangesAsync();
            return stockModel;
        }

        public async Task<List<Account>> GetAllAsync()
        {
            return await _context.Accounts.Include(p => p.Products).ToListAsync();
        }

        public async Task<Account?> GetByIdAsync(int id)
        {
            return await _context.Accounts.Include(p => p.Products).FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Account?> UpdateAsync(int id, UpdateAccountRequestDTO accountDto)
        {
            var existingAccount = await _context.Accounts.FindAsync(id);

            if(existingAccount == null)    {return null;}

            existingAccount.Name = accountDto.Name;
            existingAccount.Password = accountDto.Password;
            existingAccount.Clients = accountDto.Clients;
            existingAccount.Products = accountDto.Products;

            await _context.SaveChangesAsync();
            return existingAccount;
        }
    }
}