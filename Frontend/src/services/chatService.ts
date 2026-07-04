import api from "./api";
import type { ReceivedMessage } from "../types/ReceivedMessage";

export default class ChatService {
  static async getHistory(sessionId: number): Promise<ReceivedMessage[]> {
    const response = await api.get(`chat/${sessionId}/messages`);
    return response.data;
  }

  static async startSession(doctorId: number): Promise<number> {
    const response = await api.post(`chat/start/${doctorId}`);
    return response.data.sessionId;
  }

  static async getSessionDetails(sessionId: number): Promise<{
    sessionId: number;
    doctorName: string;
    doctorSpecialty: string;
    patientName: string;
    doctorUserId: string;
    patientUserId: string;
  }> {
    const response = await api.get(`chat/${sessionId}/details`);
    return response.data;
  }

  static async getSessions(activeRole?: string): Promise<Array<{
    sessionId: number;
    otherPartyName: string;
    otherPartyUserId: string;
    lastMessage: string;
    lastMessageTime: string | null;
  }>> {
    const response = await api.get(`chat/sessions`, { params: { activeRole } });
    return response.data;
  }
}
