import type { AvailableSlot } from "./appointment";

/** Extends API AvailableSlot with UI metadata for mock + live modes */
export interface SlotWithMeta extends AvailableSlot {
  timeLabel: string;
  slotKey: string;
  status: "available" | "booked" | "unavailable";
}

export interface SelectedSlot {
  doctorId: number;
  date: string;
  start: string;
  end: string;
  timeLabel: string;
  slotKey: string;
}

export interface BookingFeedback {
  type: "success" | "error";
  message: string;
  alternatives?: SlotWithMeta[];
}

export interface WeekDay {
  date: Date;
  dateKey: string;
  dayName: string;
  shortLabel: string;
  dayNum: number;
  isToday: boolean;
  isPast: boolean;
}
