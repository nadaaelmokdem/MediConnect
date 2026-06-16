import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MdMedicalServices, 
  MdMenu, 
  MdClose, 
  MdLogout, 
  MdNotifications, 
  MdSettings,
  MdDashboard
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to get first name
  const firstName = user?.fullName?.split(' ')[0] || 'User';

  return (
    <nav className="glass-panel text-text-main font-sans text-sm font-medium top-0 sticky z-50 border-b border-surface-variant shadow-sm transition-all duration-300 bg-white/90 backdrop-blur-md">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        
        {/* Left Section: Logo + Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-heading font-extrabold text-primary tracking-tight flex items-center gap-2 mr-5">
            <MdMedicalServices className="text-primary-light text-3xl" />
            Tabibi
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            {isAuthenticated && (
              <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors duration-200">
                Dashboard
              </Link>
            )}
            <Link to="/ai-chat" className="text-text-muted hover:text-primary transition-colors duration-200">
              Chat with AI
            </Link>
            <Link to="/find-doctor" className="text-text-muted hover:text-primary transition-colors duration-200">
              Find a Doctor
            </Link>
          </div>
        </div>

        {/* Right Section: Auth Buttons or User Menu */}
        <div className="flex items-center gap-4 md:gap-5">
          {isLoading ? (
            <div className="hidden md:flex items-center gap-3 opacity-70">
              <div className="text-right flex flex-col items-end gap-1.5">
                <div className="w-24 h-4 bg-surface-variant rounded animate-pulse"></div>
                <div className="w-16 h-3 bg-surface-variant rounded animate-pulse"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-variant animate-pulse"></div>
            </div>
          ) : !isAuthenticated ? (
            <>
              <Link to="/ai-chat" className="text-text-muted hover:text-primary transition-colors duration-200 md:block hidden">
                Are you a doctor?
              </Link>
              <Link
                to="/login"
                className="cursor-pointer bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-full transition-all duration-300 font-semibold shadow-soft hover:shadow-floating hover:-translate-y-0.5"
              >
                Log in / Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Desktop User Section */}
              <div className="hidden md:flex items-center gap-4">
                <button className="cursor-pointer text-text-muted hover:text-primary transition-colors duration-200 text-2xl relative mt-1">
                  <MdNotifications />
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="flex items-center gap-3 border-l border-surface-variant pl-4 ml-1">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-main">{firstName}</p>
                  </div>
                  
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="cursor-pointer w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold hover:bg-primary-dark transition shadow-sm overflow-hidden"
                    >
                      {user?.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt={firstName} className="w-full h-full object-cover" />
                      ) : (
                        firstName.charAt(0).toUpperCase()
                      )}
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-surface-variant rounded-lg shadow-lg py-2 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="px-4 py-2.5 text-text-main hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <MdSettings className="text-xl text-text-muted" /> 
                          Profile Settings
                        </Link>
                        <div className="h-px bg-surface-variant my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                        >
                          <MdLogout className="text-xl" /> 
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* ==== NEW: Mobile User Icon ==== */}
          {isAuthenticated && !isLoading && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden cursor-pointer w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-surface-variant"
            >
              {user?.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={firstName} className="w-full h-full object-cover" />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </button>
          )}
          {/* =============================== */}

          <button 
            className="cursor-pointer md:hidden text-2xl text-text-main hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-surface-variant p-4 flex flex-col gap-4 shadow-inner">
          {isLoading ? (
             <div className="border-b pb-3 mb-3 flex flex-col gap-2">
               <div className="w-32 h-5 bg-surface-variant rounded animate-pulse"></div>
               <div className="w-20 h-4 bg-surface-variant rounded animate-pulse"></div>
             </div>
          ) : isAuthenticated ? (
            <>
              <div className="border-b border-surface-variant pb-4 mb-2 flex justify-between items-center gap-4">
                
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm shrink-0 overflow-hidden border border-surface-variant">
                    {user?.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt={firstName} className="w-full h-full object-cover" />
                    ) : (
                      firstName.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  <p className="font-semibold text-text-main text-lg truncate">
                    Hi, {firstName}
                  </p>
                </div>

                <button className="relative text-2xl text-text-muted hover:text-primary shrink-0">
                  <MdNotifications />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
              </div>
              
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-text-main font-medium hover:text-primary flex items-center gap-3 bg-surface-variant/30 py-2 px-3 rounded-lg">
                <MdDashboard className="text-primary text-lg" /> Dashboard
              </Link>
              <Link to="/find-doctor" onClick={() => setIsOpen(false)} className="text-text-main font-medium hover:text-primary px-3">
                Find a Doctor
              </Link>
              <Link to="/ai-chat" onClick={() => setIsOpen(false)} className="text-text-main font-medium hover:text-primary px-3">
                Chat with AI
              </Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="text-text-main font-medium hover:text-primary flex items-center gap-2 px-3">
                <MdSettings className="text-lg" /> Profile Settings
              </Link>
              
              <div className="h-px bg-surface-variant mt-2"></div>
              
              <button
                onClick={handleLogout}
                className="cursor-pointer text-left text-red-600 font-semibold flex items-center gap-2 py-2 px-3"
              >
                <MdLogout className="text-xl" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/ai-chat" onClick={() => setIsOpen(false)} className="text-text-main font-medium hover:text-primary">
                Are you a doctor?
              </Link>
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white text-center py-2.5 rounded-lg font-semibold mt-2"
              >
                Log in / Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;