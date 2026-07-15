using System.Collections.Generic;

namespace Tabibi.Application.DTOs
{
    public class QuotaResponseDTO
    {
        public int FreeAiMessages { get; set; }
        public int PremiumAiMessages { get; set; }
        public int FreeGpMessages { get; set; }
    }

    public class RechargeResponseDTO
    {
        public string Message { get; set; } = string.Empty;
        public int FreeAiMessages { get; set; }
        public int PremiumAiMessages { get; set; }
    }

    public class InitiateRechargeResponseDTO
    {
        public string PaymentUrl { get; set; } = string.Empty;
        public int MessagesGranted { get; set; }
        public decimal Amount { get; set; }
    }

    public class ChatHistoryResponseDTO
    {
        public List<ChatMessageDTO> Messages { get; set; } = new();
        public string ClinicalAssessment { get; set; } = string.Empty;
    }
}
