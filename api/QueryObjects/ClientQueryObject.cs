using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.QueryObjects
{
    public class ClientQueryObject
    {
        public string? ClientName { get; set; } = null;

        public string? SortBy { get; set; } = null;
        public bool IsDescending { get; set; } = false;

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 5;
    }
}