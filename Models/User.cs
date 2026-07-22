namespace TshwaneBusApi.Models
{
    // This class maps 1-to-1 to the "User" table in MySQL.
    // Think of this like a Java POJO / entity class.
    public class User
    {
        public string Id { get; set; } = string.Empty;       // VARCHAR(13), Primary Key
        public string FullName { get; set; } = string.Empty; // VARCHAR(100)
        public string Email { get; set; } = string.Empty;    // VARCHAR(150)
        public string PasswordHash { get; set; } = string.Empty; // VARCHAR(255) - never store plain text passwords
        public DateTime CreatedAt { get; set; }              // DATETIME

        // Navigation property: lets EF Core know a User can have one BusCard.
        // This isn't a real column, it's how EF represents the relationship in C#.
        public BusCard? BusCard { get; set; }
    }
}
