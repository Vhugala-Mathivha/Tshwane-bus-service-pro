using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // These allow you to query the tables using: _context.Users, etc.
    public DbSet<User> Users => Set<User>();
    public DbSet<BusCard> BusCards => Set<BusCard>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<PaystackPayment> PaystackPayments => Set<PaystackPayment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // --- User table ---
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Id).HasColumnType("varchar(13)");
            entity.Property(u => u.Email).HasColumnType("varchar(150)");
            
            // This is critical for Login: Ensures emails aren't duplicated 
            // and makes searching by email very fast.
            entity.HasIndex(u => u.Email).IsUnique(); 
        });

        // --- BusCard table ---
        modelBuilder.Entity<BusCard>(entity =>
        {
            entity.ToTable("BusCard");
            entity.HasKey(b => b.CardNumber);
            entity.Property(b => b.UserId).HasColumnType("varchar(13)");
            entity.HasIndex(b => b.UserId).IsUnique();

            // RELATIONSHIP: One User has One BusCard
            entity.HasOne(b => b.User)
                  .WithOne(u => u.BusCard)
                  .HasForeignKey<BusCard>(b => b.UserId);
        });

        // --- Transaction table ---
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("Transaction");
            entity.HasKey(t => t.Id);

            // Matches your SQL script: Saves "Load" or "Trip" as a string in MySQL
            entity.Property(t => t.Type).HasConversion<string>();

            // RELATIONSHIP: One BusCard has Many Transactions
            entity.HasOne(t => t.BusCard)
                  .WithMany(b => b.Transactions)
                  .HasForeignKey(t => t.CardNumber);
        });
        // --- PaystackPayment table ---
        modelBuilder.Entity<PaystackPayment>(entity =>
        {
            entity.ToTable("PaystackPayment");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Reference).HasColumnType("varchar(255)");
            entity.Property(p => p.CardNumber).HasColumnType("varchar(255)");
            entity.HasIndex(p => p.Reference).IsUnique();
        });
    }
}
