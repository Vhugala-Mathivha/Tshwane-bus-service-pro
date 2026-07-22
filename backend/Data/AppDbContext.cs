using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<BusCard> BusCards { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<BusCard>().HasKey(b => b.CardNumber);
        modelBuilder.Entity<BusCard>().ToTable("BusCard");
        modelBuilder.Entity<Transaction>().ToTable("Transaction");
    }
}