namespace SignupApi.Models
{
    public class PendingRegistration
    {
        public int Id { get; set; }

        public string CardNumber { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string OTP { get; set; } = string.Empty;

        public DateTime OTPExpiry { get; set; }
    }
}