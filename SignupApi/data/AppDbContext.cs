using Microsoft.EntityFrameworkCore;
using SignupApi.Models;

namespace SignupApi.data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<BusCard> BusCards => Set<BusCard>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Table Mappings
        modelBuilder.Entity<User>().ToTable("User");
        modelBuilder.Entity<BusCard>().ToTable("BusCard");
        modelBuilder.Entity<Transaction>().ToTable("Transaction");

        // 1-to-1: User <-> BusCard
        modelBuilder.Entity<BusCard>()
            .HasOne(b => b.User)
            .WithOne(u => u.BusCard)
            .HasForeignKey<BusCard>(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // 1-to-Many: BusCard <-> Transaction
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.BusCard)
            .WithMany(b => b.Transactions)
            .HasForeignKey(t => t.CardNumber)
            .OnDelete(DeleteBehavior.Cascade);
    }
}