export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface AvailabilitySlot {
  id?: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDurationMins: number;
  isActive: boolean;
  specificDate?: string | null; // ISO date string "YYYY-MM-DD"
}

export type ActiveTab = "weekly" | "specific";
