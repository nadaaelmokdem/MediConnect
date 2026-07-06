export interface ReceivedMessage {
  messageId: number;
  sessionId: number;
  senderRole: string;
  senderName: string;
  content: string;
  sentAt: string;
}