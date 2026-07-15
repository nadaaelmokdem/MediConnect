import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStethoscope } from "react-icons/fa6";
import { MdMenu, MdClose } from "react-icons/md";

const NAV_LINKS = [
  { label: "Chat with AI", to: "/ai-chat" },
  { label: "Find a Doctor", to: "/doctors" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-white/88 backdrop-blur-md border-b border-primary/8" />
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary-light">
            <FaStethoscope size={15} className="text-white" />
          </div>
          <span className="text-3xl font-extrabold text-primary-dark tracking-tight">
            Tabibi
          </span>
        </Link>

        {/* Middle Links - Brought closer to logo using ml-10/ml-12 and pushing right items with mr-auto */}
        <div className="hidden md:flex items-center gap-6 ml-12 mr-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons (Slightly Smaller) */}
        <div className="hidden md:flex items-center gap-2.5 ml-auto">
          <Link
            to="/doctor-login"
            className="text-sm font-semibold px-3 py-1.5 rounded-lg text-primary hover:bg-surface-variant/40 transition-colors duration-150"
          >
            Doctor Login
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold px-3 py-1.5 rounded-lg text-primary hover:text-primary-dark transition-colors duration-150"
          >
            Sign In
          </Link>
          <Link
            to="/register-doctor"
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-all duration-200"
          >
            Join as Doctor
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Layout Controls */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <Link
            to="/register"
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-md transition-all duration-200"
          >
            Get Started
          </Link>
          <button
            className="p-2 rounded-lg text-primary cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 px-6 pb-6 pt-4 flex flex-col gap-3.5 bg-white/98 backdrop-blur-xl border-b border-primary/10 shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-primary-dark px-1"
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-surface-variant my-1" />

          <Link
            to="/doctor-login"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium text-primary-dark px-1"
          >
            Doctor Login
          </Link>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium text-primary-dark px-1"
          >
            Sign In
          </Link>
          
          <div className="flex flex-col gap-2 mt-2">
            <Link
              to="/register-doctor"
              onClick={() => setIsOpen(false)}
              className="text-center text-xs font-semibold px-4 py-2.5 rounded-lg border border-primary text-primary"
            >
              Join as Doctor
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="text-center text-xs font-semibold px-4 py-2.5 rounded-lg bg-primary text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;