export interface SessionInfo {
  sessionId: number;
  otherPartyName: string;
  otherPartyUserId: string;
  otherPartySpecialty?: string;
  lastMessage: string;
  lastMessageTime: string | null;
  doctorId?: number;
  otherPartyProfilePictureUrl?: string;
}

export interface GroupedContact {
  id: string;
  name: string;
  specialty?: string;
  avatar?: string;
  latestMessageTime: number;
  sessions: SessionInfo[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}
