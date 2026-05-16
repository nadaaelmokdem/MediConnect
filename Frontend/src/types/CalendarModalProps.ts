import type ScheduleItem from "./ScheduleItem";

export default interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleItem[];
  onCancelAppointment: (id: number) => void;
}