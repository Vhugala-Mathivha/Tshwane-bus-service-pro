using Microsoft.EntityFrameworkCore;
using TshwaneBusApi.Models;

namespace TshwaneBusApi.Data
{
    // AppDbContext is the equivalent of your Sequelize/Prisma "db connection" object.
    // EF Core uses this class to translate C# LINQ queries into SQL, and to know
    // which tables/columns map to which C# classes/properties.
    public class AppDbContext : DbContext
    {
        // This constructor lets ASP.NET's dependency injection hand us
        // an already-configured connection (set up in Program.cs).
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Each DbSet<T> represents one table.
        public DbSet<User> Users => Set<User>();
        public DbSet<BusCard> BusCards => Set<BusCard>();
        public DbSet<Transaction> Transactions => Set<Transaction>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // --- User table ---
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).HasColumnType("varchar(13)");
                entity.Property(u => u.Email).HasColumnType("varchar(150)");
                entity.HasIndex(u => u.Email).IsUnique(); // not strictly in your spec, but recommended for login lookups
            });

            // --- BusCard table ---
            modelBuilder.Entity<BusCard>(entity =>
            {
                entity.ToTable("BusCard");
                entity.HasKey(b => b.CardNumber);
                entity.Property(b => b.UserId).HasColumnType("varchar(13)");
                entity.HasIndex(b => b.UserId).IsUnique();

                // One User <-> One BusCard, joined on BusCard.UserId = User.Id
                entity.HasOne(b => b.User)
                      .WithOne(u => u.BusCard)
                      .HasForeignKey<BusCard>(b => b.UserId);
            });

            // --- Transaction table ---
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("Transaction");
                entity.HasKey(t => t.Id);

                // Store the enum as its string name in MySQL (e.g. "TopUp") instead of a number,
                // so it lines up with a MySQL ENUM('TopUp','Fare','Refund') column.
                entity.Property(t => t.Type).HasConversion<string>();

                // One BusCard <-> Many Transactions, joined on Transaction.CardNumber = BusCard.CardNumber
                entity.HasOne(t => t.BusCard)
                      .WithMany(b => b.Transactions)
                      .HasForeignKey(t => t.CardNumber);
            });
        }
    }
}
