using System.ComponentModel.DataAnnotations;

namespace SignupApi.Models
{
    public class User
    {
        public int Id { get; set; }

        public string CardNumber { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public DateTime RegisteredAt { get; set; } = DateTime.Now;
    }
}