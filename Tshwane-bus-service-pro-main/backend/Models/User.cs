namespace backend.Models;

public class User {
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public BusCard? BusCard { get; set; } 
}