using VCT.API.Models.Users;
using VCT.API.Services.Interfaces;
using api.Dtos.UserDtos;
using api.Interfaces;
using api.Mappers;
using api.QueryObjects;

namespace VCT.API.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _UserRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository UserRepository, ILogger<UserService> logger)
        {
            _UserRepository = UserRepository;
            _logger = logger;
        }

        public async Task<List<User>> GetAllUsersAsync(UserQueryObject query)
        {
            try
            {
                _logger.LogInformation("Retrieving all Users with query parameters");
                return await _UserRepository.GetAllAsync(query);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all Users");
                throw new InvalidOperationException("Failed to retrieve Users", ex);
            }
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Retrieving User with ID: {UserId}", id);
                
                if (id <= 0)
                {
                    _logger.LogWarning("Invalid User ID provided: {UserId}", id);
                    return null;
                }

                return await _UserRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving User with ID: {UserId}", id);
                throw new InvalidOperationException($"Failed to retrieve User with ID: {id}", ex);
            }
        }

        public async Task<User> CreateUserAsync(CreateUserRequestDTO UserDto)
        {
            try
            {
                _logger.LogInformation("Creating new User with name: {UserName}", UserDto.Name);
                
                // Business logic validation
                if (string.IsNullOrWhiteSpace(UserDto.Name))
                {
                    throw new ArgumentException("User name cannot be empty");
                }

                if (string.IsNullOrWhiteSpace(UserDto.Password))
                {
                    throw new ArgumentException("Password cannot be empty");
                }

                var UserModel = UserDto.ToUserFromCreateDTO();
                var createdUser = await _UserRepository.CreateAsync(UserModel);
                
                _logger.LogInformation("Successfully created User with ID: {UserId}", createdUser.Id);
                return createdUser;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating User with name: {UserName}", UserDto.Name);
                throw new InvalidOperationException("Failed to create User", ex);
            }
        }

        public async Task<User?> UpdateUserAsync(int id, UpdateUserRequestDTO updateDto)
        {
            try
            {
                _logger.LogInformation("Updating User with ID: {UserId}", id);
                
                if (id <= 0)
                {
                    _logger.LogWarning("Invalid User ID provided for update: {UserId}", id);
                    return null;
                }

                if (string.IsNullOrWhiteSpace(updateDto.Name))
                {
                    throw new ArgumentException("User name cannot be empty");
                }

                var updatedUser = await _UserRepository.UpdateAsync(id, updateDto);
                
                if (updatedUser != null)
                {
                    _logger.LogInformation("Successfully updated User with ID: {UserId}", id);
                }
                else
                {
                    _logger.LogWarning("User with ID: {UserId} not found for update", id);
                }

                return updatedUser;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating User with ID: {UserId}", id);
                throw new InvalidOperationException($"Failed to update User with ID: {id}", ex);
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                _logger.LogInformation("Deleting User with ID: {UserId}", id);
                
                if (id <= 0)
                {
                    _logger.LogWarning("Invalid User ID provided for deletion: {UserId}", id);
                    return false;
                }

                var deletedUser = await _UserRepository.DeleteAsync(id);
                var success = deletedUser != null;
                
                if (success)
                {
                    _logger.LogInformation("Successfully deleted User with ID: {UserId}", id);
                }
                else
                {
                    _logger.LogWarning("User with ID: {UserId} not found for deletion", id);
                }

                return success;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting User with ID: {UserId}", id);
                throw new InvalidOperationException($"Failed to delete User with ID: {id}", ex);
            }
        }

        public async Task<bool> UserExistsAsync(int id)
        {
            try
            {
                if (id <= 0) return false;
                return await _UserRepository.UserExists(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if User exists with ID: {UserId}", id);
                throw new InvalidOperationException($"Failed to check User existence with ID: {id}", ex);
            }
        }
    }
}
