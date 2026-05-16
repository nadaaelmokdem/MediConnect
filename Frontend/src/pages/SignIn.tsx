import { MdMedicalServices, MdOutlineMail, MdArrowForward } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import { AxiosError } from 'axios';

export default function TabibiLogin({ setloginEmail } : { setloginEmail : React.Dispatch<React.SetStateAction<string>>} ) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [displayError, setDisplayError] = useState<string>("");
  
  // Simple regex for basic email format validation
  const validateEmailFormat = (inputEmail: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear the error dynamically if they fix the format while typing
    if (displayError && validateEmailFormat(value)) {
      setDisplayError("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisplayError(""); // Reset error state on new submit

    // 1. Client-side validation check
    if (!email.trim()) {
      setDisplayError("Email address is required.");
      return;
    }

    if (!validateEmailFormat(email)) {
      setDisplayError("Please enter a valid email address.");
      return;
    }

    // 2. API Request if format is valid
    try {
      await api.post("/auth/check-email", email);
      setloginEmail(email);
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data === "User Not Found") {
        setloginEmail(email);
        navigate('/register');
      } else {
        setDisplayError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#fcf8ff] text-[#1a1345] text-[16px] leading-[24px] font-normal antialiased h-screen overflow-hidden flex flex-col selection:bg-[#6a5acd] selection:text-[#f0ebff]">
      <main className="flex-grow flex w-full h-full relative">
        {/* Brand Header as Clickable Button */}
        <header className="absolute top-4 left-15 z-50 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-2 text-[#5140b3] hover:opacity-80 transition-opacity duration-200"
          >
            <MdMedicalServices className="text-3xl" />
            <span className="text-2xl font-bold tracking-tight">Tabibi</span>
          </button>
        </header>
        
        {/* Full-Screen Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            alt="Tabibi Medical Group"
            className="w-full h-full object-cover object-left"
            src="doctor-login.jpg"
          />
        </div>

        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-0"></div>
          <div className="absolute inset-y-0 right-0 w-[60%] bg-gradient-to-t to-transparent backdrop-blur-sm"></div>
        </div>
        
        <div className="relative w-full h-full flex flex-col lg:flex-row z-20 max-lg:backdrop-blur-sm">
          <div className="hidden lg:flex flex-col justify-end w-[40%] p-8 lg:p-12 pb-16 lg:pb-24">
            <div className="max-w-md">
              <h2 className="text-[32px] lg:text-[40px] leading-[40px] lg:leading-[48px] tracking-[-0.01em] font-bold mb-4 text-white drop-shadow-md">
                Care that revolves around you.
              </h2>
              <p className="text-[16px] lg:text-[18px] leading-[24px] lg:leading-[28px] font-normal text-white/90 drop-shadow-sm">
                Join Tabibi today and experience modern healthcare management tailored to your needs.
              </p>
            </div>
          </div>

          {/* Right Side: Form Content Center Alignment */}
          <div className="w-full lg:w-[60%] h-full flex items-center justify-center p-4 lg:p-8 lg:p-12 ml-auto">
            <div className="w-full max-w-xl flex flex-col gap-5 lg:gap-6 bg-white/95 backdrop-blur-md p-6 lg:p-10 rounded-3xl shadow-2xl border border-white/20">
              
              {/* Brand Header */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
                <button className="flex items-center gap-2 text-[#5140b3] cursor-pointer" onClick={() => navigate('/')}>
                  <MdMedicalServices className="text-3xl lg:text-4xl" />
                  <span className="text-[28px] leading-[36px] lg:text-[40px] lg:leading-[48px] font-bold tracking-tight text-[#5140b3]">
                    Tabibi
                  </span>
                </button>
                <div className="flex flex-col gap-1 mt-1 lg:mt-2">
                  <h1 className="text-[24px] leading-[32px] lg:text-[28px] lg:leading-[36px] font-bold text-[#1a1345]">
                    Welcome to Tabibi
                  </h1>
                  <p className="text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px] font-normal text-[#474553]">
                    Enter your email to get started
                  </p>
                </div>
              </div>

              {/* Form Area with noValidate added */}
              <form className="flex flex-col gap-4 lg:gap-5" onSubmit={handleLogin} noValidate>
                {/* Error Message Banner */}
                {displayError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg transition-all animate-fadeIn">
                    <p className="text-red-600 text-xs lg:text-sm font-medium text-center">{displayError}</p>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[13px] leading-[18px] lg:text-[14px] lg:leading-[20px] tracking-[0.01em] font-semibold text-[#1a1345]" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <MdOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9c4d5] pointer-events-none text-xl" />
                    <input
                      className={`w-full h-11 lg:h-12 px-4 bg-[#ffffff]/90 backdrop-blur-sm border rounded-lg text-[15px] lg:text-[16px] leading-[24px] font-normal text-[#1a1345] placeholder:text-[#a19db3] focus:outline-none focus:ring-2 transition-all ${
                        displayError 
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                          : 'border-[#e5deff] focus:ring-[#b8a7ff] focus:border-[#b8a7ff]'
                      }`}
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      type="email"
                    />
                  </div>
                </div>
                
                <button
                  className="cursor-pointer w-full h-11 lg:h-12 flex items-center justify-center gap-2 bg-[#6a5acd] text-[#f0ebff] hover:bg-[#5140b3] hover:text-[#ffffff] rounded-full text-[14px] leading-[20px] tracking-[0.01em] font-semibold transition-all shadow-md"
                  type='submit'
                >
                  <span>Next</span>
                  <MdArrowForward className="text-lg lg:text-xl" />
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 w-full py-1">
                <div className="h-px bg-[#c9c4d5]/50 flex-grow"></div>
                <span className="text-[11px] lg:text-[12px] leading-[16px] font-medium text-[#787584]">OR</span>
                <div className="h-px bg-[#c9c4d5]/50 flex-grow"></div>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col gap-3 lg:gap-4">
                <button
                  className="cursor-pointer w-full h-11 lg:h-12 flex items-center justify-center gap-3 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] hover:bg-[#f0ebff] hover:border-[#c9c4d5] rounded-full text-[13px] lg:text-[14px] leading-[20px] tracking-[0.01em] font-semibold text-[#1a1345] transition-all"
                  type="button"
                >
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </button>
              </div>

              {/* Footer Terms */}
              <p className="text-[11px] lg:text-[12px] leading-[16px] font-medium text-center text-[#787584] mt-1 lg:mt-2">
                By continuing, you agree to Tabibi's{' '}
                <span className="text-[#5140b3] cursor-pointer">Terms of Service</span>{' '}
                and{' '}
                <span className="text-[#5140b3] cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}