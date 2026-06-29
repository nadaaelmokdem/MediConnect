namespace Tabibi.DTOs
{
    public class LoginDTO
    {
        public UserResponse User { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
