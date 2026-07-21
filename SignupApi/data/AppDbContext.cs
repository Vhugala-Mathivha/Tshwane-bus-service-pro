using Microsoft.EntityFrameworkCore;
using SignupApi.Models;

namespace SignupApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<PendingRegistration> PendingRegistrations { get; set; }
    }
}