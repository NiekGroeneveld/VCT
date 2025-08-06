using api.Data;
using api.Dtos.UserDtos;
using api.Interfaces;
using api.QueryObjects;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Users;

namespace api.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;
        public UserRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public Task<bool> UserExists(int id)
        {
            return _context.Users.AnyAsync(a => a.Id == id);
        }

        public async Task<User> CreateAsync(User UserModel)
        {
            await _context.Users.AddAsync(UserModel);
            await _context.SaveChangesAsync();
            return UserModel;
        }

        public async Task<User?> DeleteAsync(int id)
        {
            var stockModel = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);

            if(stockModel == null)    {return null;}

            _context.Users.Remove(stockModel); ///Not async!
            await _context.SaveChangesAsync();
            return stockModel;
        }

        public async Task<List<User>> GetAllAsync(UserQueryObject query)
        {
            var Users = _context.Users.Include(a => a.UserProducts).ThenInclude(ap => ap.Product).Include(c => c.UserClients).ThenInclude(ac => ac.Client).AsQueryable();
            
            if(!string.IsNullOrWhiteSpace(query.UserName))
            {
                Users = Users.Where(a => a.Name.Contains(query.UserName));
            }

            
            if(!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if(query.SortBy.Equals("UserName" , StringComparison.OrdinalIgnoreCase))
                {
                    Users = query.IsDescending 
                        ? Users.OrderByDescending(a => a.Name) 
                        : Users.OrderBy(a => a.Name);
                }
            }

            var skipNumber = (query.PageNumber - 1) * query.PageSize;
            
            return await Users.Skip(skipNumber).Take(query.PageSize).ToListAsync();

        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.Include(a => a.UserProducts).ThenInclude(ap => ap.Product).Include(c => c.UserClients).ThenInclude(ac => ac.Client).FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<User?> UpdateAsync(int id, UpdateUserRequestDTO UserDto)
        {
            var existingUser = await _context.Users
                                        .Include(a=> a.UserProducts)
                                        .Include(c => c.UserClients)
                                        .FirstOrDefaultAsync(a => a.Id == id); //await _context.Users.FindAsync(id);

            if(existingUser == null)    {return null;}

            existingUser.Name = UserDto.Name;
            existingUser.Password = UserDto.Password;

            await _context.SaveChangesAsync();
            return existingUser;
        }
    }
}