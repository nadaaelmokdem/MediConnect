import { useCallback, useState } from "react";
import type { DoctorListItem } from "../types/public";
import type { BookingFeedback, SelectedSlot, SlotWithMeta } from "../types/booking";
import {
  createInitialBookedSlots,
  findAlternativeSlots,
  toSelectedSlot,
} from "../utils/slotUtils";

export function useDoctorBooking() {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorListItem | null>(
    null,
  );
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(
    () => createInitialBookedSlots(),
  );
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [feedback, setFeedback] = useState<BookingFeedback | null>(null);
  const [daySlots, setDaySlots] = useState<SlotWithMeta[]>([]);

  const openSchedule = useCallback((doctor: DoctorListItem) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setFeedback(null);
    setDaySlots([]);
    setScheduleOpen(true);
  }, []);

  const closeSchedule = useCallback(() => {
    setScheduleOpen(false);
    setSelectedSlot(null);
    setFeedback(null);
    setDaySlots([]);
  }, []);

  const selectSlot = useCallback(
    (slot: SlotWithMeta, dateKey: string) => {
      if (!selectedDoctor) return;

      setFeedback(null);

      if (slot.status === "unavailable") return;

      if (slot.status === "booked" || bookedSlots.has(slot.slotKey)) {
        const alternatives = findAlternativeSlots(daySlots, slot.slotKey);
        setFeedback({
          type: "error",
          message: `${slot.timeLabel} is already booked. Please choose another time.`,
          alternatives,
        });
        setSelectedSlot(null);
        return;
      }

      setSelectedSlot(toSelectedSlot(selectedDoctor.doctorId, slot, dateKey));
      setFeedback({
        type: "success",
        message: `Selected ${slot.timeLabel}. Review and confirm your booking.`,
      });
    },
    [selectedDoctor, bookedSlots, daySlots],
  );

  const confirmBooking = useCallback(() => {
    if (!selectedDoctor || !selectedSlot) return;

    if (bookedSlots.has(selectedSlot.slotKey)) {
      const alternatives = findAlternativeSlots(daySlots, selectedSlot.slotKey);
      setFeedback({
        type: "error",
        message: "This slot was just taken. Please pick another time.",
        alternatives,
      });
      setSelectedSlot(null);
      return;
    }

    setBookedSlots((prev) => new Set(prev).add(selectedSlot.slotKey));
    setFeedback({
      type: "success",
      message: `Appointment confirmed with Dr. ${selectedDoctor.fullName} on ${selectedSlot.date} at ${selectedSlot.timeLabel}.`,
    });
    setSelectedSlot(null);

    setDaySlots((prev) =>
      prev.map((s) =>
        s.slotKey === selectedSlot.slotKey
          ? { ...s, status: "booked" as const, isAvailable: false }
          : s,
      ),
    );
  }, [selectedDoctor, selectedSlot, bookedSlots, daySlots]);

  const pickAlternative = useCallback(
    (slot: SlotWithMeta, dateKey: string) => {
      selectSlot(slot, dateKey);
    },
    [selectSlot],
  );

  return {
    selectedDoctor,
    selectedSlot,
    bookedSlots,
    scheduleOpen,
    feedback,
    daySlots,
    setDaySlots,
    openSchedule,
    closeSchedule,
    selectSlot,
    confirmBooking,
    pickAlternative,
    setFeedback,
  };
}
