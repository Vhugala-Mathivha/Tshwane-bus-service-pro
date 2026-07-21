using Microsoft.EntityFrameworkCore;
using SignupApi.Models;

namespace SignupApi.Data
{
    public class TshwaneDbContext : DbContext
    {
        public TshwaneDbContext(DbContextOptions<TshwaneDbContext> options)
            : base(options)
        {
        }

        public DbSet<CardHolder> CardHolders { get; set; }
    }
}