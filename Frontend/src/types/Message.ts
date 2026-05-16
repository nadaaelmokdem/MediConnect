export default interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  context?: string;
}