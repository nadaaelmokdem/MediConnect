import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MdMedicalServices, 
  MdOutlineMail, 
  MdArrowForward, 
  MdPerson, 
  MdLock,
  MdVisibility,
  MdVisibilityOff 
} from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';

type UserType = 'patient' | 'doctor';

export default function SignUp({ loginMail } : {loginMail : string}) {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: loginMail,
    password: '',
    confirmPassword: '',
    userType: 'patient' as UserType,
  });
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setLocalError('');

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(form.fullName, form.email, form.password, form.userType);
      navigate('/');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Sign up failed');
    }
  };

  const displayError = localError;

  return (
    <div className="bg-[#fcf8ff] text-[#1a1345] text-[15px] leading-[22px] font-normal antialiased h-screen overflow-hidden flex flex-col selection:bg-[#6a5acd] selection:text-[#f0ebff]">
      <main className="flex-grow flex w-full h-full relative z-20 overflow-hidden">
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

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-0"></div>
          <div className="absolute inset-y-0 right-0 w-[60%] bg-gradient-to-t to-transparent backdrop-blur-sm hidden lg:block"></div>
        </div>

        <div className="relative w-full h-full flex flex-col lg:flex-row z-20 max-lg:backdrop-blur-sm overflow-hidden">
          
          {/* Left Side: Hero Text */}
          <div className="hidden lg:flex flex-col justify-end w-[35%] p-8 lg:p-12 pb-16 lg:pb-24">
            <div className="max-w-md">
              <h2 className="text-[32px] lg:text-[36px] leading-[38px] lg:leading-[44px] tracking-[-0.01em] font-bold mb-3 text-white drop-shadow-md">
                Care that revolves around you.
              </h2>
              <p className="text-[15px] lg:text-[16px] leading-[22px] lg:leading-[26px] font-normal text-white/90 drop-shadow-sm">
                Join Tabibi today and experience modern healthcare management tailored to your needs.
              </p>
            </div>
          </div>

          {/* Right Side: Form Content Center Alignment - Expanded Width for Long Inputs */}
          <div className="w-full lg:w-[65%] h-full flex items-center justify-center p-4 lg:p-6 ml-auto overflow-hidden">
            {/* Compact, Wider Form Card */}
            <div className="w-full max-w-2xl flex flex-col gap-3 bg-white/95 backdrop-blur-md p-5 lg:p-6 rounded-3xl shadow-2xl border border-white/20">
              
              {/* Brand Header */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-1">
                <button className="flex items-center gap-2 text-[#5140b3] cursor-pointer"
                      onClick={() => navigate('/')}>
                  <MdMedicalServices className="text-2xl lg:text-3xl" />
                  <span className="text-[24px] leading-[32px] lg:text-[32px] lg:leading-[40px] font-bold tracking-tight text-[#5140b3]">
                    Tabibi
                  </span>
                </button>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <h1 className="text-[20px] leading-[28px] lg:text-[24px] lg:leading-[32px] font-bold text-[#1a1345]">
                    Create Account
                  </h1>
                  <p className="text-[13px] leading-[18px] lg:text-[14px] lg:leading-[20px] font-normal text-[#474553]">
                    Join our medical community
                  </p>
                </div>
              </div>

              {/* Form Area */}
              <form className="flex flex-col gap-2.5 lg:gap-3" onSubmit={handleSignup}>
                
                {/* Error Message */}
                {displayError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs font-medium text-center">{displayError}</p>
                  </div>
                )}

                {/* Form Inputs Grid Row 1 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1 flex-1 relative">
                    <label className="text-[12px] leading-[16px] lg:text-[13px] lg:leading-[18px] tracking-[0.01em] font-semibold text-[#1a1345]" htmlFor="fullName">
                      Full Name
                    </label>
                    <div className="relative">
                      <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9c4d5] pointer-events-none text-lg" />
                      <input
                        className="w-full h-10 lg:h-10.5 p-4 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] rounded-lg text-[14px] lg:text-[15px] leading-[22px] font-normal text-[#1a1345] placeholder:text-[#a19db3] focus:outline-none focus:ring-2 focus:ring-[#b8a7ff] focus:border-[#b8a7ff] transition-all"
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        type="text"
                        required
                        value={form.fullName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1 flex-1 relative">
                    <label className="text-[12px] leading-[16px] lg:text-[13px] lg:leading-[18px] tracking-[0.01em] font-semibold text-[#1a1345]" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <MdOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9c4d5] pointer-events-none text-lg" />
                      <input
                        className="w-full h-10 lg:h-10.5 p-4 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] rounded-lg text-[14px] lg:text-[15px] leading-[22px] font-normal text-[#1a1345] placeholder:text-[#a19db3] focus:outline-none focus:ring-2 focus:ring-[#b8a7ff] focus:border-[#b8a7ff] transition-all"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Inputs Grid Row 2 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Password */}
                  <div className="flex flex-col gap-1 flex-1 relative">
                    <label className="text-[12px] leading-[16px] lg:text-[13px] lg:leading-[18px] tracking-[0.01em] font-semibold text-[#1a1345]" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9c4d5] pointer-events-none text-lg" />
                      <input
                        className="w-full h-10 lg:h-10.5 pl-4 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] rounded-lg text-[14px] lg:text-[15px] leading-[22px] font-normal text-[#1a1345] placeholder:text-[#a19db3] focus:outline-none focus:ring-2 focus:ring-[#b8a7ff] focus:border-[#b8a7ff] transition-all"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number, one uppercase, one lowercase letter, and at least 8 characters"
                        value={form.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a19db3] hover:text-[#5140b3] focus:outline-none cursor-pointer text-lg p-1 rounded transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1 flex-1 relative">
                    <label className="text-[12px] leading-[16px] lg:text-[13px] lg:leading-[18px] tracking-[0.01em] font-semibold text-[#1a1345]" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9c4d5] pointer-events-none text-lg" />
                      <input
                        className="w-full h-10 lg:h-10.5 pl-4 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] rounded-lg text-[14px] lg:text-[15px] leading-[22px] font-normal text-[#1a1345] placeholder:text-[#a19db3] focus:outline-none focus:ring-2 focus:ring-[#b8a7ff] focus:border-[#b8a7ff] transition-all"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a19db3] hover:text-[#5140b3] focus:outline-none cursor-pointer text-lg p-1 rounded transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Submit Action */}
                <button
                  className="cursor-pointer mt-1 w-full h-10 lg:h-10.5 flex items-center justify-center gap-2 bg-[#6a5acd] text-[#f0ebff] hover:bg-[#5140b3] hover:text-[#ffffff] rounded-full text-[13px] lg:text-[14px] leading-[20px] tracking-[0.01em] font-semibold transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                  {!isLoading && <MdArrowForward className="text-md lg:text-lg" />}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full py-0.5">
                <div className="h-px bg-[#c9c4d5]/50 flex-grow"></div>
                <span className="text-[10px] lg:text-[11px] leading-[14px] font-medium text-[#787584]">OR</span>
                <div className="h-px bg-[#c9c4d5]/50 flex-grow"></div>
              </div>

              {/* Secondary Actions Layer */}
              <div className="flex flex-col gap-2">
                {/* Google Sign Up */}
                <button
                  className="cursor-pointer w-full h-10 lg:h-10.5 flex items-center justify-center gap-2.5 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] hover:bg-[#f0ebff] hover:border-[#c9c4d5] rounded-full text-[13px] lg:text-[14px] leading-[20px] tracking-[0.01em] font-semibold text-[#1a1345] transition-all"
                  type="button"
                  disabled={isLoading}
                >
                  <FcGoogle className="w-4.5 h-4.5" />
                  Continue with Google
                </button>

                {/* Switch to Login */}
                <button
                  className="cursor-pointer w-full h-10 lg:h-10.5 flex items-center justify-center bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] hover:bg-[#f0ebff] hover:border-[#c9c4d5] rounded-full text-[13px] lg:text-[14px] leading-[20px] tracking-[0.01em] font-semibold text-[#1a1345] transition-all"
                  type="button"
                  onClick={() => navigate('/login')}
                  disabled={isLoading}
                >
                  Already have an account? <span className="text-[#5140b3] ml-1">Sign in here</span>
                </button>
              </div>

              {/* Footer Terms */}
              <p className="text-[10px] lg:text-[11px] leading-[14px] font-medium text-center text-[#787584] mt-0.5">
                By creating an account, you agree to Tabibi's{' '}
                <span className="text-[#5140b3]">Terms of Service</span>
                {' '}and{' '}
                <span className="text-[#5140b3]">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}