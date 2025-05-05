using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Clients;
using api.Mappers;

namespace api.Repository
{
    public class ClientRepository : IClientRepository
    {
        private readonly ApplicationDBContext _context;
        
        public ClientRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Client> CreateAsync(Client clientModel)
        {
            await _context.Clients.AddAsync(clientModel);
            await _context.SaveChangesAsync();
            return clientModel;
        }

        public async Task<List<Client>> GetAllAsync()
        {
            return await _context.Clients.ToListAsync();
        }

        public async Task<Client?> GetByIdAsync(int id)
        {
            return await _context.Clients.FindAsync(id);
        }
    }
}