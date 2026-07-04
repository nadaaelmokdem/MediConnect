export interface ReceivedMessage {
  messageId: number;
  sessionId: number;
  senderRole: "User" | "Doctor";
  senderName: string;
  content: string;
  sentAt: string;
}