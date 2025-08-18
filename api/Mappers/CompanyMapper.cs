using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Company;
using api.Models;

namespace api.Mappers
{
    public static class CompanyMapper
    {
        public static CompanyDTO ToDTO(this Company company)
        {
            return new CompanyDTO
            {
                Id = company.Id,
                Name = company.Name,
                Configurations = company.Configurations.Select(c => c.ToDTO()).ToList(),
                Products = company.Products.Select(p => p.ToMinimalDTO()).ToList()
            };
        }

        public static Company ToCompanyFromCreateDTO(this CreateCompanyDTO dto)
        {
            return new Company
            {
                Name = dto.Name
            };
        }

        public static Company ToCompanyFromUpdateDTO(this UpdateCompanyDTO dto, Company existingCompany)
        {
            existingCompany.Name = dto.Name;
            return existingCompany;
        }
    }
}