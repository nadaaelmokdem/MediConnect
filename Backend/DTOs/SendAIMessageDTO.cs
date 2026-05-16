namespace Tabibi.DTOs
{
    public class SendAIMessageDTO
    {
        public required string RequestText { get; set; }
        public required string ContextText { get; set; } = "";
    }
}
