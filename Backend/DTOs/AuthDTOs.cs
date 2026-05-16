namespace Tabibi.DTOs
{
    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class SignupRequest
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? UserType { get; set; } = "patient"; // "patient" or "doctor"
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = "";
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }

    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public UserResponse? User { get; set; }
        public string? Token { get; set; }
    }

    public class UserResponse
    {
        public string Id { get; set; } = "";
        public string Email { get; set; } = "";
        public string FullName { get; set; } = "";
        public string? ProfilePictureUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserType { get; set; } = "patient"; // "patient", "doctor", or "admin"
    }
}
