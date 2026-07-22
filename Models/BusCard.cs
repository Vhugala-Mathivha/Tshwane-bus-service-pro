namespace TshwaneBusApi.Models
{
    public class BusCard
    {
        public string CardNumber { get; set; } = string.Empty; // VARCHAR(20), Primary Key
        public string UserId { get; set; } = string.Empty;     // VARCHAR(13), Foreign Key -> User.Id, UNIQUE
        public decimal Balance { get; set; }                   // DECIMAL(10,2)

        // Navigation property back to the owning User.
        public User? User { get; set; }

        // Navigation property: one card can have many transactions.
        public List<Transaction> Transactions { get; set; } = new();
    }
}
