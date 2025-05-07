using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using VCT.API.Models.Clients;
using api.Mappers;
using api.Dtos.ClientDtos;
using api.QueryObjects;

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

        public async  Task<Client?> DeleteAsync(int id)
        {
            var clientModel = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);

            if(clientModel == null)    {return null;}

            _context.Clients.Remove(clientModel); ///Not async!
            await _context.SaveChangesAsync();
            return clientModel;
        }

        public async Task<List<Client>> GetAllAsync(ClientQueryObject query)
        {
            var clients =  _context.Clients.Include(c => c.ClientProducts).ThenInclude(cp => cp.Product).Include(m => m.Machines).AsQueryable();

            if(!string.IsNullOrWhiteSpace(query.ClientName))
            {
                clients = clients.Where(c => c.Name.Contains(query.ClientName));
            }

            if(!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if(query.SortBy.Equals("ClientName" , StringComparison.OrdinalIgnoreCase))
                {
                    clients = query.IsDescending ? clients.OrderByDescending(c => c.Name) : clients.OrderBy(c => c.Name);
                }
            }

            var skipNumber = (query.PageNumber - 1) * query.PageSize;

            return await clients.Skip(skipNumber).Take(query.PageSize).ToListAsync();

        }

        public async Task<Client?> GetByIdAsync(int id)
        {
            return await _context.Clients.Include(cp=> cp.ClientProducts).ThenInclude(p => p.Product).Include(m => m.Machines).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Client?> UpdateAsync(int id, UpdateClientRequestDTO updateDTO)
        {
            var existingClient = await _context.Clients.Include(cp => cp.ClientProducts).ThenInclude(p => p.Product).Include(m => m.Machines).FirstOrDefaultAsync(c => c.Id == id);

            if(existingClient == null)    {return null;}

            existingClient.Name = updateDTO.Name;

            await _context.SaveChangesAsync();
            return existingClient;
        }
    }
}