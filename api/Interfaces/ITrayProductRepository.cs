using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Interfaces
{
    public interface ITrayProductRepository
    {
        public Task<bool> DeleteAsync(int trayId, int productId);
    }
}