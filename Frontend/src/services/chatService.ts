import api from "./api";
import type { ReceivedMessage } from "./chatHubService";

export default class ChatService {
  static async getHistory(sessionId: number): Promise<ReceivedMessage[]> {
    const response = await api.get(`chat/${sessionId}/messages`);
    // Backend returns { senderRole: ... } matching ReceivedMessage shape
    // one-to-one (both ChatMessageDTO and ReceiveMessagePayload use the
    // same field names), so no mapping needed here.
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

  static async getSessions(): Promise<Array<{
    sessionId: number;
    otherPartyName: string;
    otherPartyUserId: string;
    lastMessage: string;
    lastMessageTime: string | null;
  }>> {
    const response = await api.get(`chat/sessions`);
    return response.data;
  }
}
