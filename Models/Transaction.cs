namespace TshwaneBusApi.Models
{
    // Matches the ENUM column in MySQL. Adjust these values to match
    // whatever ENUM('...') values you actually define in your MySQL table.
    public enum TransactionType
    {
        TopUp,
        Fare,
        Refund
    }

    public class Transaction
    {
        public int Id { get; set; }                    // INT, Primary Key
        public string CardNumber { get; set; } = string.Empty; // VARCHAR(20), Foreign Key -> BusCard.CardNumber
        public decimal Amount { get; set; }             // DECIMAL(10,2)
        public TransactionType Type { get; set; }       // ENUM
        public DateTime TransactionDate { get; set; }    // DATETIME
        public string Description { get; set; } = string.Empty; // VARCHAR(255)

        public BusCard? BusCard { get; set; }
    }
}
