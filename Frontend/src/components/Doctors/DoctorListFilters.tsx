import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";

interface Specialty {
  specialtyId: number;
  name: string;
}

interface ConsultationType {
  label: string;
  value: number;
}

interface DoctorListFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSpecialty: number | "";
  setSelectedSpecialty: (id: number | "") => void;
  specialties: Specialty[];
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  handleSearch: () => void;
  consultationTypes: ConsultationType[];
  filter: any;
  handleBookingTypeToggle: (val: number) => void;
}

export default function DoctorListFilters({
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
  specialties,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleSearch,
  consultationTypes,
  filter,
  handleBookingTypeToggle
}: DoctorListFiltersProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 mb-10 border border-primary/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-surface-variant/50">
          <FaFilter size={13} className="text-primary" />
        </div>
        <span className="font-bold text-lg text-primary-dark tracking-tight">Filters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-6">
        <div className="relative lg:col-span-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-outline-variant" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-surface-container/40 focus:bg-white"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <select
          className="w-full lg:col-span-3 px-4 py-3 rounded-xl border border-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-surface-container/40 focus:bg-white cursor-pointer"
          value={selectedSpecialty}
          onChange={e => setSelectedSpecialty(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">All Specialties</option>
          {specialties.map(s => (
            <option key={s.specialtyId} value={s.specialtyId}>{s.name}</option>
          ))}
        </select>

        <div className="flex gap-2 lg:col-span-3">
          <input
            type="number"
            placeholder="Min (EGP)"
            className="w-full px-4 py-3 rounded-xl border border-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-surface-container/40 focus:bg-white"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max (EGP)"
            className="w-full px-4 py-3 rounded-xl border border-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-surface-container/40 focus:bg-white"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full lg:col-span-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl shadow-floating transition-all transform hover:-translate-y-0.5 cursor-pointer flex justify-center items-center gap-2"
        >
          <FaSearch /> Apply
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary-light mr-2">Consultation Types</span>
        {consultationTypes.map(type => {
          const isActive = (filter.bookingTypes || []).includes(type.value);
          return (
            <button
              key={type.value}
              onClick={() => handleBookingTypeToggle(type.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-on-surface-variant border-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
