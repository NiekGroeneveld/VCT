using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class TrayProductRepository : ITrayProductRepository
    {
        private readonly ApplicationDBContext _context;

        public TrayProductRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<bool> DeleteAsync(int trayId, int productId)
        {
            var trayProduct = await _context.TrayProducts
                .FirstOrDefaultAsync(tp => tp.TrayId == trayId && tp.ProductId == productId);
            if (trayProduct == null) return false;

            _context.TrayProducts.Remove(trayProduct);
            await _context.SaveChangesAsync();
            return true;
        }

          
    }
}