using Google.GenAI;
using Google.GenAI.Types;
using Type = Google.GenAI.Types.Type;

namespace MediConnectAPI.Services
{
    public class AIDoctor(IConfiguration config)
    {
        public async Task<string> Ask(string msg, string prevContext = "")
        {
            var client = new Client(apiKey: config.GetValue<string>("AIKey")!);
            string systemInstruction =
                    @"# ROLE
                        You are a Helpful Medical Intake and Triage AI working for Tabibi. 
                        Core Logic: Provide comprehensive wellness suggestions, practical home remedies, and general over-the-counter (OTC) medication information for minor issues. Clarify missing information. Escalate ONLY when severe risks, red-flag symptoms, or emergencies are present.

                        # STRICT RULES
                        1. LANGUAGE: 
                           - IF the user speaks English: The `user_facing_reply` MUST be in English.
                           - IF the user speaks Arabic: The `user_facing_reply` MUST be strictly in Modern Standard Arabic (MSA). Do not use regional dialects or colloquialisms.
                        2. FORMAT: Output ONLY raw, valid JSON. Do not include markdown code blocks (e.g., ```json), conversational filler, prose, or <thought> tags. 
                        3. LOGIC & HELPFULNESS: 
                           - Always assume the user is male
                           - Always check 'Previous Context' first. 
                           - For minor, common, or non-severe symptoms (e.g., common cold, mild headache, minor scrapes, general fatigue, mild indigestion), DO NOT escalate. 
                           - Instead of escalating minor issues, provide highly actionable help: suggest specific home care strategies (rest, hydration, etc.) and provide general educational information on standard OTC active ingredients (e.g., mentioning ibuprofen or acetaminophen for pain, saline spray for congestion, or antacids for heartburn).
                           - Only classify as 'doctor_escalation' for true emergencies, necessary physical exams, symptoms persisting beyond typical recovery periods, or severe/red-flag symptoms (e.g., chest pain, shortness of breath, severe bleeding).
                           - The input text is a continuation to the case you already have.                            

                        # JSON SCHEMA
                        {
                          ""user_facing_reply"": ""Your actionable, helpful response to the patient, including OTC info or home remedies if appropriate."",
                          ""classification"": ""Must be exactly one of: wellness_suggestion, clarification_needed, doctor_escalation"",
                          ""recommended_departments"": [""Array of string medical specialties if escalated, otherwise empty []""],
                          ""clinical_assessment"": ""Brief clinical summary of the case written in English."",
                          ""urgency_level"": ""Must be exactly one of: low, medium, high, emergency""
                        }";

            Schema Diagnosis = new Schema
            {
                Properties =
            new Dictionary<string, Schema> {
                {
                "user_facing_reply", new Schema { Type = Type.String, Title = "user_facing_reply" }
                },
                {
                "classification", new Schema { Type = Type.String, Title = "classification" }
                },
                {
                "recommended_departments", new Schema { Type = Type.String, Title = "recommended_departments" }
                },
                {
                "clinical_assessment", new Schema { Type = Type.String, Title = "clinical_assessment" }
                },
                {
                "urgency_level", new Schema { Type = Type.String, Title = "urgency_level" }
                }
            },
                    PropertyOrdering =
                new List<string> { "user_facing_reply", "classification", "recommended_departments", "clinical_assessment", "urgency_level" },
                    Required = new List<string> { "user_facing_reply", "classification", "recommended_departments", "clinical_assessment", "urgency_level" },
                    Title = "Diagnosis",
                    Type = Type.Object
                };

            var generateContentConfig =
                new GenerateContentConfig
                {
                    SystemInstruction = new Content
                    {
                        Parts = new List<Part> {
                          new Part {Text = systemInstruction}
                      }
                    },
                    
                    ResponseMimeType = "application/json",
                    ResponseSchema = Diagnosis
                };

            var response = await client.Models.GenerateContentAsync(
                 model: "gemini-3.1-flash-lite-preview",
                 contents: $"Previous Context: {prevContext}\nUser: {msg}",
                 config: generateContentConfig
                 );
            return response?.Candidates?[0]?.Content?.Parts?[0].Text ?? "";

        }
    }
}