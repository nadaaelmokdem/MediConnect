import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { WeekDay } from "../../types/booking";

interface WeekDayPickerProps {
  days: WeekDay[];
  selectedDateKey: string;
  onSelect: (day: WeekDay) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  /** Optional: how many available slots each day has, keyed by dateKey */
  slotCountByDate?: Record<string, number>;
}

function formatDateRange(days: WeekDay[]): string {
  if (!days.length) return "";
  const first = days[0].date;
  const last  = days[days.length - 1].date;

  const sameMonth = first.getMonth() === last.getMonth();
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

  if (sameMonth) {
    return `${first.toLocaleDateString("en-US", opts)} – ${last.getDate()}`;
  }
  return `${first.toLocaleDateString("en-US", opts)} – ${last.toLocaleDateString("en-US", opts)}`;
}

const WeekDayPicker: React.FC<WeekDayPickerProps> = ({
  days,
  selectedDateKey,
  onSelect,
  onPrevWeek,
  onNextWeek,
  slotCountByDate = {},
}) => {
  const dateRange = formatDateRange(days);
  const year = days[0]?.date.getFullYear();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPrevWeek}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary/10 text-gray-500 hover:text-primary transition-colors cursor-pointer"
          aria-label="Previous week"
        >
          <FaChevronLeft size={12} />
        </button>

        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">{dateRange}</p>
          <p className="text-xs text-gray-400">{year}</p>
        </div>

        <button
          type="button"
          onClick={onNextWeek}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary/10 text-gray-500 hover:text-primary transition-colors cursor-pointer"
          aria-label="Next week"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Day Buttons */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((day) => {
          const isSelected = day.dateKey === selectedDateKey;
          const disabled   = day.isPast;
          const slotCount  = slotCountByDate[day.dateKey] ?? 0;
          const hasSlots   = slotCount > 0;

          return (
            <button
              key={day.dateKey}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(day)}
              className={`
                flex flex-col items-center py-2 sm:py-3 px-1 rounded-xl text-center
                transition-all duration-200 border relative
                ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                    : disabled
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary hover:shadow-sm cursor-pointer"
                }
              `}
            >
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide">
                {day.shortLabel}
              </span>
              <span className="text-base sm:text-lg font-bold leading-tight mt-0.5">
                {day.dayNum}
              </span>

              {/* Today indicator */}
              {day.isToday && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
              )}
              {day.isToday && isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 mt-0.5" />
              )}

              {/* Slot availability dot */}
              {!disabled && !day.isToday && (
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected
                      ? "bg-white/60"
                      : hasSlots
                      ? "bg-green-400"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekDayPicker;
