using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ApplicationDBContext _context;

        public CompanyRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Company> CreateAsync(Company company)
        {
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<Company?> DeleteAsync(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null) return null;

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<List<Company>> GetAllAsync()
        {
            return await _context.Companies.Include(c => c.Configurations).Include(c => c.Products).ToListAsync();
        }

        public async Task<Company?> GetByIdAsync(int id)
        {
            return await _context.Companies.Include(c => c.Configurations).Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        }

        public Task<List<Company>> GetCompaniesForUserAsync(string userId)
        {
            return _context.Companies.Where(c => c.Users.Select(u => u.Id).Contains(userId)).Include(c => c.Configurations).Include(c => c.Products).ToListAsync();
        }

        public async Task<Company?> UpdateAsync(Company company)
        {
            var existingCompany = await GetByIdAsync(company.Id);
            if (existingCompany == null) return null;

            existingCompany = company;

            await _context.SaveChangesAsync();
            return existingCompany;
        }
    }
}