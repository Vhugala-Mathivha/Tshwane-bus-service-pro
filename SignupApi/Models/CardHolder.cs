using System.ComponentModel.DataAnnotations;

namespace SignupApi.Models
{
    public class CardHolder
    {
        [Key]
        public string CardNumber { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
    }
}