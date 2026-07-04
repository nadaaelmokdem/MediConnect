import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PublicService from "../services/publicService";
import type { DoctorListItem, DoctorSearchFilter } from "../types/public";
import DoctorCard from "../components/Doctor/DoctorCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatService from "../services/chatService";

const DoctorsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [specialties, setSpecialties] = useState<{ specialtyId: number; name: string }[]>([]);
  
  const [filter, setFilter] = useState<DoctorSearchFilter>({
    page: 1,
    pageSize: 10,
    bookingTypes: [],
  });
  
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Search Inputs state (to allow typing before fetching)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | "">("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const consultationTypes = [
    { value: 0, label: "Chat" },
    { value: 1, label: "Video" },
    { value: 2, label: "Call" },
    { value: 3, label: "Clinic" }
  ];

  useEffect(() => {
    const fetchSpecialties = async () => {
      const sp = await PublicService.getSpecialties();
      setSpecialties(sp);
    };
    fetchSpecialties();
  }, []);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await PublicService.getDoctors(filter);
      setDoctors(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSearch = () => {
    setFilter(prev => ({
      ...prev,
      page: 1,
      name: searchTerm || undefined,
      specialtyId: selectedSpecialty ? Number(selectedSpecialty) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }));
  };

  const handleBookingTypeToggle = (val: number) => {
    setFilter(prev => {
      const current = prev.bookingTypes || [];
      const newTypes = current.includes(val) 
        ? current.filter(t => t !== val)
        : [...current, val];
      return { ...prev, bookingTypes: newTypes, page: 1 };
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilter(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookAppointment = (doctorId: number) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnUrl: "/doctors" } });
    } else if (user?.activeRole?.toLowerCase() === "doctor") {
      alert("Doctors cannot book appointments.");
    } else {
      // In a real app, this would open a booking modal or navigate to a booking page
      alert(`Booking appointment with doctor ID: ${doctorId}`);
    }
  };

  const handleStartChat = async (doctorId: number) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnUrl: "/doctors" } });
      return;
    }
    if (user?.activeRole?.toLowerCase() === "doctor") {
      alert("Doctors cannot start chats with other doctors.");
      return;
    }
    
    try {
      const sessionId = await ChatService.startSession(doctorId);
      navigate(`/chat/${sessionId}`);
    } catch (err: any) {
      alert(err.response?.data || "Failed to start chat session.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-4 drop-shadow-sm">
            Find Your Perfect Doctor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our extensive list of highly qualified medical professionals. Filter by specialty, price, and consultation type to find exactly what you need.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-10 border border-white/50">
          <div className="flex items-center gap-2 mb-4 text-primary font-bold text-lg">
            <FaFilter /> Filters
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-6">
            <div className="relative lg:col-span-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search by name..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <select 
              className="w-full lg:col-span-3 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white cursor-pointer"
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value as number | "")}
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Max (EGP)" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-gray-50/50 focus:bg-white"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleSearch}
              className="w-full lg:col-span-2 bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex justify-center items-center gap-2"
            >
              <FaSearch /> Apply
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 mr-2">Consultation Types:</span>
            {consultationTypes.map(type => {
              const isActive = (filter.bookingTypes || []).includes(type.value);
              return (
                <button
                  key={type.value}
                  onClick={() => handleBookingTypeToggle(type.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-primary text-white border-primary shadow-md' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : doctors.length > 0 ? (
          <div className="space-y-6">
            <div className="text-gray-500 font-medium px-2">
              Found {totalCount} doctor{totalCount !== 1 ? 's' : ''} matching your criteria
            </div>
            {doctors.map(doctor => (
              <DoctorCard 
                key={doctor.doctorId} 
                doctor={doctor} 
                onBookAppointment={handleBookAppointment} 
                onStartChat={handleStartChat}
              />
            ))}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12 mb-8">
                <button 
                  onClick={() => handlePageChange((filter.page || 1) - 1)}
                  disabled={(filter.page || 1) === 1}
                  className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    (filter.page || 1) === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-primary shadow-md hover:shadow-lg hover:bg-blue-50'
                  }`}
                >
                  <FaChevronLeft />
                </button>
                
                <span className="font-semibold text-gray-700">
                  Page {filter.page} of {totalPages}
                </span>
                
                <button 
                  onClick={() => handlePageChange((filter.page || 1) + 1)}
                  disabled={(filter.page || 1) === totalPages}
                  className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    (filter.page || 1) === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-primary shadow-md hover:shadow-lg hover:bg-blue-50'
                  }`}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-gray-300 mb-4 flex justify-center">
              <FaSearch size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("");
                setMinPrice("");
                setMaxPrice("");
                setFilter({ page: 1, pageSize: 10, bookingTypes: [] });
              }}
              className="mt-6 text-primary hover:text-blue-700 font-semibold transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorsPage;
