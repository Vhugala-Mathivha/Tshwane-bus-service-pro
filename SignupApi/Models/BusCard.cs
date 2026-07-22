using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SignupApi.Models;

[Table("BusCard")]
public class BusCard
{
    [Key]
    [StringLength(20)]
    public string CardNumber { get; set; } = string.Empty; // e.g., "9283 4721 0056 3391"

    [Required]
    [StringLength(13)]
    public string UserId { get; set; } = string.Empty; // FK to User(Id)

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Balance { get; set; } = 50.00m;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = [];
}