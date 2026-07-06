import api from "./api";
import type { ReceivedMessage } from "../types/ReceivedMessage";

export interface AIResponse {
  user_facing_reply: string;
  classification: string;
  recommended_departments: string[];
  clinical_assessment: string;
  urgency_level: string;
  topic_drift_detected: boolean;
  sessionId?: number;
}

export default async function fetchAI(
  requestText: string,
  contextText: string,
  sessionId?: number
): Promise<AIResponse> {
  const response = await api.post<AIResponse>("AI/ask", {
    requestText,
    contextText,
    sessionId,
  });
  return response.data;
}

export interface AiQuotaResponse {
  freeAiMessages: number;
  premiumAiMessages: number;
  freeGpMessages?: number;
}

export async function getAiQuota(): Promise<AiQuotaResponse> {
  const response = await api.get<AiQuotaResponse>("AI/quota");
  return response.data;
}

export async function rechargeAiQuota(amount: number): Promise<AiQuotaResponse> {
  const response = await api.post<AiQuotaResponse>("AI/recharge", { amount });
  return response.data;
}

export interface AiHistoryResponse {
  messages: ReceivedMessage[];
  clinicalAssessment: string;
}

export async function getAiHistory(sessionId: number): Promise<AiHistoryResponse> {
  const response = await api.get<any>(`AI/history/${sessionId}`);
  if (Array.isArray(response.data)) {
    return { messages: response.data, clinicalAssessment: "" };
  }
  return response.data;
}
