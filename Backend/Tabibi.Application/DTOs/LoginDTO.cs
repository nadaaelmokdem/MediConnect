namespace Tabibi.Application.DTOs
{
    public class LoginDTO
    {
        public UserResponse? User { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        
        public bool IsNewUser { get; set; }
        public string? GoogleName { get; set; }
        public string? GoogleEmail { get; set; }
        public string? GoogleToken { get; set; }
    }
}
