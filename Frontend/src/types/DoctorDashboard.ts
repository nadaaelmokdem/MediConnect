export interface ScheduleItem {
  id: number;
  time: string;
  duration: string;
  name: string;
  type: string;
  badge: string;
  date: string;
  initials: string;
  avatar?: string;
}

export interface RequestItem {
  id: number;
  name: string;
  time: string;
  timeDisplay: string;
  concern: string;
  initials: string;
}

export interface ChatMessage {
  id: number;
  name: string;
  text: string;
  time: string;
  initials: string;
  isOnline: boolean;
}
