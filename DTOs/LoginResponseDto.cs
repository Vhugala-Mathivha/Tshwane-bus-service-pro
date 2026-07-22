namespace TshwaneBusApi.DTOs
{
    // What the frontend receives back after a successful login.
    // Notice PasswordHash is NOT here - never send password data back to the client.
    public class LoginResponseDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? CardNumber { get; set; }
        public decimal Balance { get; set; }
    }
}
