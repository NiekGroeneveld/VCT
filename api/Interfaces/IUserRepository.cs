
using api.Dtos.UserDtos;
using api.QueryObjects;
using VCT.API.Models.Users;

namespace api.Interfaces
{
    public interface IUserRepository
    {
        //Native
        Task<List<User>> GetAllAsync(UserQueryObject query);

        Task<User?> GetByIdAsync(int id);    //FirstOrDefault CAN BE NULL
        Task<User> CreateAsync(User UserModel);

        Task<User?> UpdateAsync(int id, UpdateUserRequestDTO UserDto);

        Task<User?> DeleteAsync(int id);

        
        
        //Additional
        Task<bool> UserExists(int id);

    }
}