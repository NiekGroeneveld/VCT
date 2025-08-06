using VCT.API.Models.Users;
using api.Dtos.UserDtos;
using api.QueryObjects;

namespace VCT.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync(UserQueryObject query);
        Task<User?> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(CreateUserRequestDTO UserDto);
        Task<User?> UpdateUserAsync(int id, UpdateUserRequestDTO updateDto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UserExistsAsync(int id);
    }
}
