import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import {
  filterMockDoctors,
  MOCK_SPECIALTY_NAMES,
} from "../data/mockDoctors";
import type { DoctorListItem } from "../types/public";
import type { BookingFeedback, SelectedSlot, SlotWithMeta } from "../types/booking";
import DoctorCard from "../components/Doctor/DoctorCard";
import AppointmentService from "../services/appointmentService";
import BookingScheduleModal from "../components/Doctor/BookingScheduleModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PublicService from "../services/publicService";

const DoctorsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Modal State
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [feedback, setFeedback] = useState<BookingFeedback | null>(null);
  
  // Mock DB State for current session
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [daySlots, setDaySlots] = useState<SlotWithMeta[]>([]);

  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      let specId: number | undefined;
      if (selectedSpecialty) {
        const idx = MOCK_SPECIALTY_NAMES.indexOf(selectedSpecialty);
        if (idx !== -1) {
          specId = idx + 1;
        }
      }

      const result = await PublicService.getDoctors({
        name: searchTerm || undefined,
        specialtyId: specId,
      });
      setDoctors(result.items);
    } catch (err) {
      console.error("Error loading doctors:", err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, selectedSpecialty]);

  const handleSearch = () => {
    fetchDoctors();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
  };

  const handleBookAppointment = (doctorId: number) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnUrl: "/doctors" } });
    } else if (user?.activeRole?.toLowerCase() === "doctor") {
      alert("Doctors cannot book appointments.");
    } else {
      setSelectedDoctorId(doctorId);
      setIsModalOpen(true);
      setSelectedSlot(null);
      setFeedback(null);
      setDaySlots([]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId(null);
    setSelectedSlot(null);
    setFeedback(null);
  };

  const handleSlotsLoaded = (slots: SlotWithMeta[]) => {
    setDaySlots(slots);
    setSelectedSlot(null);
    setFeedback(null);
  };

  const getAlternativeSlots = (currentSlots: SlotWithMeta[], excludeKey: string) => {
    return currentSlots
      .filter((s) => s.status === "available" && s.slotKey !== excludeKey)
      .slice(0, 3);
  };

  const handleSelectSlot = (slot: SlotWithMeta, dateKey: string) => {
    if (slot.status !== "available" || bookedSlots.has(slot.slotKey)) {
      setFeedback({
        type: "error",
        message: "This slot is no longer available.",
        alternatives: getAlternativeSlots(daySlots, slot.slotKey),
      });
      setSelectedSlot(null);
      return;
    }

    setFeedback(null);
    setSelectedSlot({
      doctorId: selectedDoctorId!,
      date: dateKey,
      start: slot.start,
      end: slot.end,
      timeLabel: slot.timeLabel,
      slotKey: slot.slotKey,
    });
  };

  const handleConfirmBooking = async (typeStr: "clinic" | "video" | "call" | "chat" = "clinic") => {
    if (!selectedSlot) return;

    try {
      const typeMap: Record<string, number> = {
        chat: 0,
        video: 1,
        call: 2,
        clinic: 3,
      };
      const apiType = typeMap[typeStr] ?? 3;

      // Call backend to create the appointment
      await AppointmentService.bookAppointment({
        doctorId: selectedSlot.doctorId,
        scheduledAt: selectedSlot.start,
        type: apiType as any,
      });

      // Optimistically update local UI state
      setBookedSlots((prev) => {
        const next = new Set(prev);
        next.add(selectedSlot.slotKey);
        return next;
      });
      setDaySlots((prev) =>
        prev.map((s) => (s.slotKey === selectedSlot.slotKey ? { ...s, status: "booked" } : s))
      );

      setFeedback({
        type: "success",
        message: `Appointment successfully booked for ${selectedSlot.timeLabel}!`,
      });
      setSelectedSlot(null);

      // Refresh slots for the current date to reflect any server-side changes
      setDaySlots([]);
    } catch (err) {
      console.error("Booking failed", err);
      setFeedback({
        type: "error",
        message: "Failed to book appointment. Please try again.",
      });
    }
  };


  const selectedDoctorObj = useMemo(
    () => doctors.find((d) => d.doctorId === selectedDoctorId),
    [doctors, selectedDoctorId]
  );

  const handleStartChat = (doctorId: number) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnUrl: "/doctors" } });
      return;
    }
    if (user?.activeRole?.toLowerCase() === "doctor") {
      alert("Doctors cannot start chats with other doctors.");
      return;
    }
    alert(`Chat with doctor ID: ${doctorId} — connect API when ready.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-4 drop-shadow-sm">
            Find Your Perfect Doctor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse qualified medical professionals, view their weekly schedules, and book a time that works for you.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-10 border border-white/50">
          <div className="flex items-center gap-2 mb-4 text-primary font-bold text-lg">
            <FaFilter /> Filters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="relative md:col-span-5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <select
              className="w-full md:col-span-4 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white cursor-pointer"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {MOCK_SPECIALTY_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="w-full md:col-span-3 bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex justify-center items-center gap-2"
            >
              <FaSearch /> Apply
            </button>
          </div>
        </div>

        {loadingDoctors ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : doctors.length > 0 ? (
          <div className="space-y-6">
            <div className="text-gray-500 font-medium px-2">
              Showing {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
            </div>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.doctorId}
                doctor={doctor}
                onBookAppointment={handleBookAppointment}
                onStartChat={handleStartChat}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-gray-300 mb-4 flex justify-center">
              <FaSearch size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your filters to find what you&apos;re looking for.</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 text-primary hover:text-blue-700 font-semibold transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {selectedDoctorObj && (
        <BookingScheduleModal
          doctor={selectedDoctorObj}
          isOpen={isModalOpen}
          selectedSlot={selectedSlot}
          feedback={feedback}
          bookedSlots={bookedSlots}
          daySlots={daySlots}
          onClose={handleCloseModal}
          onSlotsLoaded={handleSlotsLoaded}
          onSelectSlot={handleSelectSlot}
          onConfirm={handleConfirmBooking}
          onPickAlternative={handleSelectSlot}
        />
      )}
    </div>
  );
};

export default DoctorsPage;
