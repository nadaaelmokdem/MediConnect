import React from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import type { DoctorDayAvailability } from "../../types/doctor";

interface DoctorAvailabilityScheduleProps {
  availability: DoctorDayAvailability[];
}

const DoctorAvailabilitySchedule: React.FC<DoctorAvailabilityScheduleProps> = ({
  availability,
}) => {
  if (!availability.length) {
    return (
      <p className="text-sm text-gray-400 italic flex items-center gap-2">
        <FaCalendarAlt className="text-primary/50" />
        No schedule published yet
      </p>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <FaCalendarAlt className="text-primary/70" />
        Weekly Schedule
      </p>
      <div className="space-y-3">
        {availability.map((dayBlock) => (
          <div key={dayBlock.day}>
            <p className="text-sm font-medium text-gray-700 mb-1.5">
              {dayBlock.day}
            </p>
            <div className="flex flex-wrap gap-2">
              {dayBlock.slots.map((slot) => (
                <span
                  key={`${dayBlock.day}-${slot}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  <FaClock className="text-[10px] opacity-70" />
                  {slot}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAvailabilitySchedule;
