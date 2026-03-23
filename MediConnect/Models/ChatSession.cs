using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace MediConnect.Models
{
    internal class ChatSession
    {
        public class ChatSession
        {
            [Key]
            public int SessionId { get; set; }

            public int PatientId { get; set; }

            public DateTime StartedAt { get; set; } = DateTime.UtcNow;
            public DateTime? EndedAt { get; set; }

            public SessionStatus Status { get; set; } = SessionStatus.Active;

            [MaxLength(2000)]
            public string? SessionSummary { get; set; }   // AI-generated summary

            // Navigation
            [ForeignKey(nameof(PatientId))]
            public PatientProfile Patient { get; set; } = null!;

            public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
            public SymptomAnalysis? SymptomAnalysis { get; set; }
        }

        public enum SessionStatus { Active, Completed, Abandoned }
    }
}
