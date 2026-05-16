import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMedicalServices, MdMenu, MdClose, MdLogout } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass-panel text-text-main font-sans text-sm font-medium top-0 sticky z-50 border-b border-surface-variant shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        
        {/* Left Section: Logo + Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-heading font-extrabold text-primary tracking-tight flex items-center gap-2 mr-5">
            <MdMedicalServices className="text-primary-light text-3xl" />
            Tabibi
          </Link>

          {/* Desktop Navigation Links */}
          { (
            <div className="hidden md:flex gap-6 items-center">
              <Link to="/ai-chat" className="text-text-muted hover:text-primary transition-colors duration-200">
                Chat with AI
              </Link>
              <Link to="/find-doctor" className="text-text-muted hover:text-primary transition-colors duration-200">
                Find a Doctor
              </Link>
            </div>
          )}
        </div>

        {/* Right Section: Auth Buttons or User Menu */}
        <div className="flex items-center gap-5">
          <Link to="/ai-chat" className="text-text-muted hover:text-primary transition-colors duration-200 md:block hidden">
                Are you a doctor?
              </Link>
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="cursor-pointer bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-full transition-all duration-300 font-semibold shadow-soft hover:shadow-floating hover:-translate-y-0.5"
              >
                Log in / Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* User Menu */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-main">{user?.fullName}</p>
                  <p className="text-xs text-text-muted">{user?.userType}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold hover:bg-primary-dark transition"
                  >
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-surface-variant rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                      >
                        <MdLogout /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Mobile Sandwich Button */}
          <button 
            className="md:hidden text-2xl text-text-main"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-surface-variant p-4 flex flex-col gap-4">
          {isAuthenticated && (
            <>
              <div className="border-b pb-3 mb-3">
                <p className="font-semibold text-text-main">{user?.fullName}</p>
                <p className="text-xs text-text-muted">{user?.userType}</p>
              </div>
              <Link to="/find-doctor" onClick={() => setIsOpen(false)}>Find a Doctor</Link>
              <Link to="/ai-chat" onClick={() => setIsOpen(false)}>Chat with AI</Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-600 font-semibold flex items-center gap-2"
              >
                <MdLogout /> Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/ai-chat">
                Are you a doctor?
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;