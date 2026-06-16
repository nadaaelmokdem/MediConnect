import { 
  MdMedicalServices, 
  MdOutlineLock, 
  MdArrowForward, 
  MdVisibility, 
  MdVisibilityOff, 
  MdEmail,
  MdDevices
} from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Password({ loginMail }: { loginMail: string }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [displayError, setDisplayError] = useState<string>("");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const validatePasswordFormat = (inputPassword: string) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\\/ ]).{8,}$/;
    return passwordRegex.test(inputPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (displayError && validatePasswordFormat(value)) {
      setDisplayError("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisplayError("");

    if (!password) {
      setDisplayError("Password is required.");
      return;
    }

    if (!validatePasswordFormat(password)) {
      setDisplayError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    try {
      setIsLoading(true);
      await login(loginMail, password);
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data === "Invalid Email Or Password") {
        setDisplayError("Invalid Email Or Password!");
      } else {
        setDisplayError("An unexpected error occurred. Please try again.");
      }
    }
    finally {
        setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = () => {
    console.log("Magic link requested for:", loginMail);
  };

  const handleAuthenticatorSignIn = () => {
    console.log("Authenticator verification requested");
  };

  useEffect(() => {
    if (!loginMail) {
        navigate('/login');
    }
  }, [loginMail, navigate]);

  return (
    <div className="bg-[#fcf8ff] text-[#1a1345] text-[15px] leading-[23px] font-normal antialiased h-screen max-h-screen overflow-hidden flex flex-col selection:bg-[#6a5acd] selection:text-[#f0ebff]">
      <main className="flex-grow flex w-full h-full relative overflow-hidden">
        
        
        {/* Full-Screen Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
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
        
        <div className="relative w-full h-full flex flex-col lg:flex-row z-20 max-lg:backdrop-blur-sm overflow-hidden">
          <div className="hidden lg:flex flex-col justify-end w-[40%] p-8 lg:p-12 pb-16 lg:pb-22">
            <div className="max-w-md">
              <h2 className="text-[32px] lg:text-[38px] leading-[38px] lg:leading-[46px] tracking-[-0.01em] font-bold mb-3 text-white drop-shadow-md">
                Care that revolves around you.
              </h2>
              <p className="text-[15px] lg:text-[17px] leading-[23px] lg:leading-[27px] font-normal text-white/90 drop-shadow-sm">
                Join Tabibi today and experience modern healthcare management tailored to your needs.
              </p>
            </div>
          </div>

          {/* Right Side: Form Content Center Alignment */}
          <div className="w-full lg:w-[60%] h-full flex items-center justify-center p-4 lg:p-8 ml-auto overflow-hidden">
            <div className="w-full max-w-lg flex flex-col gap-4 lg:gap-5 bg-white/95 backdrop-blur-md p-5 lg:p-9 rounded-3xl shadow-2xl border border-white/20">
              
              {/* Brand Header */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
                <button className="flex items-center gap-2 text-[#5140b3] cursor-pointer" onClick={() => navigate('/')}>
                  <MdMedicalServices className="text-2xl lg:text-3xl" />
                  <span className="text-[26px] leading-[34px] lg:text-[36px] lg:leading-[44px] font-bold tracking-tight text-[#5140b3]">
                    Tabibi
                  </span>
                </button>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <h1 className="text-[22px] leading-[30px] lg:text-[26px] lg:leading-[34px] font-bold text-[#1a1345]">
                    Welcome to Tabibi
                  </h1>
                  <p className="text-[13px] leading-[19px] lg:text-[15px] lg:leading-[22px] font-normal text-[#474553]">
                    Enter your password to proceed
                  </p>
                </div>
              </div>

              {/* User Email Banner Module */}
              <div className="bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between border border-outline-variant/50 text-[13px] lg:text-[15px] w-full">
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-6">
                    <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-medium text-sm flex-shrink-0">
                    {loginMail[0]?.toUpperCase()}
                    </div>
                    <span className="text-on-surface font-medium truncate">
                    {loginMail}
                    </span>
                </div>
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-primary hover:underline cursor-pointer font-medium flex-shrink-0"
                    disabled={isLoading}
                >
                    Change
                </button>

                </div>

              {/* Form Area */}
              <form className="flex flex-col gap-4" onSubmit={handleLogin} noValidate>
                {/* Error Message Banner */}
                {displayError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg transition-all animate-fadeIn">
                    <p className="text-red-600 text-xs font-medium text-center">{displayError}</p>
                  </div>
                )}
                
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[12px] lg:text-[13px] font-semibold text-[#1a1345]" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <MdOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9c4d5] pointer-events-none text-xl" />
                    
                    <input
                      className={`w-full h-11 lg:h-11.5 p-5 bg-[#ffffff]/90 backdrop-blur-sm border rounded-lg text-[14px] lg:text-[15px] font-normal text-[#1a1345] placeholder:text-[#a19db3] focus:outline-none focus:ring-2 transition-all ${
                        displayError 
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                          : 'border-[#e5deff] focus:ring-[#b8a7ff] focus:border-[#b8a7ff]'
                      } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      autoComplete="password"
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                    />

                    {/* Toggle Password Visibility Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a19db3] hover:text-[#1a1345] transition-colors cursor-pointer text-xl"
                      disabled={isLoading}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>
                </div>
                
                <button
                  className={`w-full h-11 lg:h-11.5 flex items-center justify-center gap-2 bg-[#6a5acd] text-[#f0ebff] hover:bg-[#5140b3] hover:text-[#ffffff] rounded-full text-[13px] lg:text-[14px] font-semibold transition-all shadow-md ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  type='submit'
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Logging In...' : 'Log In'}</span>
                  {!isLoading && <MdArrowForward className="text-base lg:text-lg" />}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full py-0.5">
                <div className="h-px bg-[#c9c4d5]/45 flex-grow"></div>
                <span className="text-[10px] lg:text-[11px] font-bold text-[#787584]">OR</span>
                <div className="h-px bg-[#c9c4d5]/45 flex-grow"></div>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-col gap-3">
                {/* Google Button */}
                <button
                  className={`w-full h-11 lg:h-11.5 flex items-center justify-center gap-3 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] hover:bg-[#f0ebff] hover:border-[#c9c4d5] rounded-full text-[13px] font-semibold text-[#1a1345] transition-all ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  type="button"
                  disabled={isLoading}
                >
                  <FcGoogle className="w-4.5 h-4.5" />
                  Continue with Google
                </button>

                {/* Magic Link Button */}
                <button
                  onClick={handleMagicLinkSignIn}
                  className={`w-full h-11 lg:h-11.5 flex items-center justify-center gap-3 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] hover:bg-[#f0ebff] hover:border-[#c9c4d5] rounded-full text-[13px] font-semibold text-[#1a1345] transition-all ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  type="button"
                  disabled={isLoading}
                >
                  <MdEmail className="w-4.5 h-4.5 text-[#5140b3]" />
                  Sign in with Email Code
                </button>

                {/* Authenticator App Button */}
                <button
                  onClick={handleAuthenticatorSignIn}
                  className={`w-full h-11 lg:h-11.5 flex items-center justify-center gap-3 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] hover:bg-[#f0ebff] hover:border-[#c9c4d5] rounded-full text-[13px] font-semibold text-[#1a1345] transition-all ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  type="button"
                  disabled={isLoading}
                >
                  <MdDevices className="w-4.5 h-4.5 text-[#5140b3]" />
                  Sign in with Authenticator App
                </button>
              </div>

              {/* Footer Terms */}
              <p className="text-[11px] font-medium text-center text-[#787584] mt-0.5">
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