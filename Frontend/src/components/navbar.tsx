import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMedicalServices, MdMenu, MdClose } from 'react-icons/md';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/ai-chat" className="text-text-muted hover:text-primary transition-colors duration-200">
              Chat with AI
            </Link>
            <Link to="/find-doctor" className="text-text-muted hover:text-primary transition-colors duration-200">
              Find a Doctor
            </Link>
          </div>
        </div>

        {/* Right Section: Auth Buttons */}
        <div className="flex items-center gap-5">
          <button className="cursor-pointer bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-full transition-all duration-300 font-semibold shadow-soft hover:shadow-floating hover:-translate-y-0.5">
            Log in / Sign Up
          </button>
          
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
          <Link to="/find-doctor" onClick={() => setIsOpen(false)}>Find a Doctor</Link>
          <Link to="/ai-chat" onClick={() => setIsOpen(false)}>Chat with AI</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;