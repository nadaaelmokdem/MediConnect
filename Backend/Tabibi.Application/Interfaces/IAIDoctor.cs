namespace Tabibi.Application.Interfaces;

public interface IAIDoctor
{
    Task<string> Ask(string msg, string prevContext = "");
}
