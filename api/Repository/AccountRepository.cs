using api.Data;
using api.Dtos.AccountDtos;
using api.Interfaces;
using api.QueryObjects;
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

        public Task<bool> AccountExists(int id)
        {
            return _context.Accounts.AnyAsync(a => a.Id == id);
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

        public async Task<List<Account>> GetAllAsync(AccountQueryObject query)
        {
            var accounts = _context.Accounts.Include(p => p.Products).Include(c => c.Clients).AsQueryable();
            
            if(!string.IsNullOrWhiteSpace(query.AccountName))
            {
                accounts = accounts.Where(a => a.Name.Contains(query.AccountName));
            }

            
            if(!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if(query.SortBy.Equals("AccountName" , StringComparison.OrdinalIgnoreCase))
                {
                    accounts = query.IsDescending ? accounts.OrderByDescending(a => a.Name) : accounts.OrderBy(a => a.Name);
                }
            }

            var skipNumber = (query.PageNumber - 1) * query.PageSize;
            
            return await accounts.Skip(skipNumber).Take(query.PageSize).ToListAsync();

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