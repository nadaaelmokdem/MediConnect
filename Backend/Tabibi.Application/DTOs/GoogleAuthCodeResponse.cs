namespace Tabibi.Application.DTOs;

public class GoogleAuthCodeResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public UserResponse? User { get; set; }
    public string? Token { get; set; }
    public bool IsNewUser { get; set; }
    public string? GoogleName { get; set; }
    public string? GoogleEmail { get; set; }
    public string? RedirectUri { get; set; }
}