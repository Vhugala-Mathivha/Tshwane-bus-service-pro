namespace TshwaneBusApi.DTOs
{
    // DTO = Data Transfer Object. It's just a plain class that describes
    // the exact shape of JSON coming in from the React fetch() call.
    // We use this instead of the User model directly so we never accidentally
    // expose/require fields like PasswordHash or CreatedAt from the frontend.
    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
