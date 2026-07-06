using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Tabibi.Models
{
   
        public class ChatMessage
        {
            [Key]
            public int MessageId { get; set; }

            public int SessionId { get; set; }

            [Required, MaxLength(10)]
            public string Role { get; set; } = "";     // "user" | "assistant"

            [Required]
            public string Content { get; set; } = "";

            public DateTime SentAt { get; set; } = DateTime.UtcNow;

            public int TokensUsed { get; set; } = 0;   // for billing tracking

            // Navigation
            [ForeignKey(nameof(SessionId))]
            public ChatSession Session { get; set; } = null!;
        }
    }

