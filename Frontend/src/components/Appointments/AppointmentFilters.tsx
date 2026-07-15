import React from "react";
import { MdSearch, MdFilterList, MdClear } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import {
  CONSULTATION_TYPE_OPTIONS,
  STATUS_OPTIONS,
  getConsultationTypeLabel,
  MdCircle,
} from "../../utils/appointmentUtils";
import { format } from "date-fns";

export interface AppointmentFiltersState {
  status: string;
  type: string;
  fromDate: string;
  toDate: string;
  search: string;
}

interface AppointmentFiltersProps {
  filters: AppointmentFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<AppointmentFiltersState>>;
  hasActiveFilters: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
}

export function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary-dark">
      {label}
      <button
        onClick={onRemove}
        className="text-primary-dark hover:text-red-500 hover:bg-red-50 p-0.5 rounded-full transition-colors"
      >
        <MdClear size={12} />
      </button>
    </span>
  );
}

export default function AppointmentFilters({
  filters,
  setFilters,
  hasActiveFilters,
  searchLabel = "Search",
  searchPlaceholder = "Type to search...",
}: AppointmentFiltersProps) {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-variant p-5 space-y-5">
      <div className="flex items-center gap-2 text-primary font-semibold text-sm">
        <MdFilterList size={18} />
        <span>Filter Appointments</span>
      </div>

      {/* Top row of inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant flex items-center gap-1">
            <MdSearch size={13} /> {searchLabel}
          </label>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
            <input
              type="text"
              name="search"
              placeholder={searchPlaceholder}
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-9 pr-3 py-2 border border-surface-variant rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
        </div>

        {/* From Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant flex items-center gap-1">
            <LuCalendarDays size={13} /> From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-surface-variant rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant flex items-center gap-1">
            <LuCalendarDays size={13} /> To Date
          </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-surface-variant rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>
      </div>

      {/* Bottom row of pill selections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
        {/* Status pills */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant">Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const active = filters.status === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilters((f) => ({ ...f, status: opt.value }))}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-on-surface-variant border-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  <MdCircle size={8} className={active ? "text-white" : opt.color} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Type pills */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-outline-variant">Consultation Type</label>
          <div className="flex flex-wrap gap-2">
            {CONSULTATION_TYPE_OPTIONS.map((opt) => {
              const active = filters.type === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilters((f) => ({ ...f, type: opt.value }))}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-on-surface-variant border-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-surface-container">
          <span className="text-xs text-outline-variant font-medium mt-1">Active:</span>
          {filters.search && <Pill label={`Search: "${filters.search}"`} onRemove={() => setFilters((f) => ({ ...f, search: "" }))} />}
          {filters.status && <Pill label={`Status: ${filters.status}`} onRemove={() => setFilters((f) => ({ ...f, status: "" }))} />}
          {filters.type !== "" && <Pill label={`Type: ${getConsultationTypeLabel(filters.type)}`} onRemove={() => setFilters((f) => ({ ...f, type: "" }))} />}
          {filters.fromDate && <Pill label={`From: ${format(new Date(filters.fromDate), "MMM d, yyyy")}`} onRemove={() => setFilters((f) => ({ ...f, fromDate: "" }))} />}
          {filters.toDate && <Pill label={`To: ${format(new Date(filters.toDate), "MMM d, yyyy")}`} onRemove={() => setFilters((f) => ({ ...f, toDate: "" }))} />}
        </div>
      )}
    </div>
  );
}
