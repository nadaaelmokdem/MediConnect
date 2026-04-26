import api from "./api";

export interface AIResponse {
    user_facing_reply: string;
    classification: string;
    recommended_departments: string[];
    clinical_assessment: string;
    urgency_level: string;
}

export default async function fetchAI(requestText: string, contextText: string): Promise<AIResponse> {
    const response = await api.post<AIResponse>('AI', { requestText, contextText });
    return response.data;
}