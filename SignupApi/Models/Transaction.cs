using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SignupApi.Models;

[Table("Transaction")]
public class Transaction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(20)]
    public string CardNumber { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Amount { get; set; }

    [Required]
    [StringLength(10)]
    public string Type { get; set; } = "Load"; // Matches ENUM('Load', 'Trip')

    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;

    [StringLength(255)]
    public string? Description { get; set; }

    // Navigation property
    [ForeignKey(nameof(CardNumber))]
    public BusCard? BusCard { get; set; }
}