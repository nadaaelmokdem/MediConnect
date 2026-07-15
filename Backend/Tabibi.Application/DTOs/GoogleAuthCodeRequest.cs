namespace Tabibi.Application.DTOs;

public class GoogleAuthCodeRequest
{
    public string Code { get; set; } = "";
    public string RedirectUri { get; set; } = "";
    public string Role { get; set; } = "Patient";
}