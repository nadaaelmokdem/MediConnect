import { 
  MdSmartToy,
  MdCheckCircle, 
  MdHealthAndSafety, 
  MdVideoCameraFront, 
  MdVideocam, 
  MdChat, 
  MdLocalHospital, 
  MdAccountBalanceWallet,
  MdMedicalServices,
  MdDashboard,
  MdArrowForward,
  MdMonetizationOn,
  MdLock,
  MdBolt
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const freeAiMessages = 12;
  const freeDoctorMessages = 3;
  const paidAiMessages = 12;
  const paidDoctorMessages = 3;

  return (
    <>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-4 pb-8 lg:pt-8 lg:pb-12 px-4 md:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
            
            {/* Top Grid: Text & Image */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              
              <div className="space-y-8 md:space-y-10 relative z-10 flex flex-col justify-center py-4 lg:py-6 items-center text-center md:items-start md:text-left w-full">
                
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-dark leading-[1.1] tracking-tight">
                  Smart Medical Care,<br/>
                  <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">Instantly.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-text-muted max-w-xl leading-relaxed font-light mx-auto md:mx-0">
                  Experience the future of healthcare. Get immediate AI assessments or connect directly with top medical professionals from anywhere, at any time.
                </p>
                
                {/* --- CTA Area --- */}
                <div className="pt-2 relative flex flex-col items-center md:items-start w-full">
                  <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10 animate-blob animation-delay-2000"></div>
                  
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-4 max-w-xl w-full mx-auto md:mx-0">
                      
                      {/* Primary Focus: Dashboard Button (Slightly larger, matching pill shape) */}
                      <button 
                        className="w-full cursor-pointer bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3.5 sm:py-4 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group overflow-hidden relative"
                        onClick={() => navigate("/find-doctor")}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <div className="relative z-10 flex items-center gap-2.5">
                          <div className="bg-white/20 p-1.5 rounded-full">
                            <MdDashboard className="text-xl" />
                          </div>
                          <span className="text-base md:text-xl">Open Dashboard</span>
                        </div>
                        <MdArrowForward className="text-xl relative z-10 transition-transform group-hover:translate-x-1" />
                      </button>

                      {/* Secondary Quick Actions (Smaller, matching guest buttons) */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
                        <button 
                          className="flex-1 cursor-pointer bg-surface text-primary-dark border border-surface-variant px-5 py-2.5 sm:py-3 rounded-full font-bold hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group text-sm md:text-base"
                          onClick={() => navigate("/ai-chat")}
                        >
                          <MdSmartToy className="text-xl text-primary transition-transform group-hover:scale-110" />
                          AI Chat
                        </button>
                        
                        <button 
                          className="flex-1 cursor-pointer bg-surface text-primary-dark border border-surface-variant px-5 py-2.5 sm:py-3 rounded-full font-bold hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group text-sm md:text-base"
                          onClick={() => navigate("/doctors")}
                        >
                          <MdHealthAndSafety className="text-xl text-primary transition-transform group-hover:scale-110" />
                          Browse Doctors
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* Balanced Guest Controls */
                    <div className="flex flex-col gap-6 w-full max-w-xl">
                      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 justify-center md:justify-start w-full">
                        <button 
                          className="cursor-pointer bg-primary text-white px-8 py-4 md:py-5 rounded-full font-bold text-base md:text-lg shadow-floating hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3 group hover:-translate-y-1 w-full sm:flex-1 md:w-full lg:w-auto lg:flex-none"
                          onClick={() => navigate("/ai-chat")}
                        >
                          <MdSmartToy className="text-2xl transition-transform group-hover:scale-110 shrink-0" />
                          <span className="whitespace-nowrap">Chat with AI</span>
                        </button>
                        <button 
                          className="cursor-pointer bg-surface text-primary-dark border border-surface-variant px-8 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-surface-variant transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group hover:-translate-y-1 w-full sm:flex-1 md:w-full lg:w-auto lg:flex-none"
                          onClick={() => navigate("/doctors")}
                        >
                          <MdHealthAndSafety className="text-2xl text-primary transition-transform group-hover:scale-110 shrink-0" />
                          <span className="whitespace-nowrap">Find a Doctor</span>
                        </button>
                      </div>

                      {/* Informational Micro-badging */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 pt-2 text-xs md:text-sm text-text-muted font-medium w-full">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <MdCheckCircle className="text-primary text-base shrink-0" /> Free daily assessment credits
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <MdBolt className="text-primary text-base shrink-0" /> No sign-up required to start
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <MdLock className="text-primary text-base shrink-0" /> Secure & private
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Image container */}
              <div className="relative w-full h-[400px] md:h-full min-h-[400px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-floating backdrop-blur-sm mt-8 md:mt-0">
                <img alt="Doctor using a tablet in a modern, brightly lit clinical setting" className="absolute inset-0 w-full h-full object-cover" data-alt="Modern female doctor in a white coat looking thoughtfully at a digital tablet in a bright, clean medical office with soft natural lighting and subtle lavender accents." src="/doctor-hero.jpg"/>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 glass-panel p-4 md:p-5 rounded-2xl shadow-floating flex items-center gap-4 md:gap-5 transform transition-transform hover:scale-[1.02] cursor-default border border-white/40">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MdCheckCircle className="text-2xl md:text-3xl" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-primary-dark text-base md:text-lg">AI Assessment Complete</p>
                    <p className="text-xs md:text-sm text-text-muted mt-1">Recommended Action: <span className="text-primary font-medium">General Practice</span></p>
                  </div>
                </div>
              </div>

            </div>

            {/* Quota Section */}
            {isAuthenticated && (
              <div className="w-full max-w-7xl mx-auto bg-surface/60 backdrop-blur-md border border-surface-variant p-5 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-lg flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8 transform transition-all duration-500 mt-2">
                
                <div className="flex flex-col lg:flex-row xl:flex-1 gap-6 lg:gap-8 w-full">
                  
                  {/* Free Messages Section */}
                  <div className="space-y-3 md:space-y-4 w-full lg:w-1/2 xl:w-auto xl:flex-1">
                    <h4 className="text-xs md:text-sm uppercase tracking-widest text-text-muted font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      Daily Free Quota
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4 bg-white/80 border border-surface-variant p-4 rounded-xl md:rounded-2xl shadow-sm min-w-0">
                        <div className="p-2 md:p-2.5 bg-primary/10 rounded-xl shrink-0">
                          <MdSmartToy className="text-primary-dark text-xl" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-2xl md:text-3xl xl:text-4xl font-heading font-extrabold text-primary-dark leading-none truncate">{freeAiMessages}</span>
                          <span className="text-xs md:text-sm text-text-muted font-medium mt-1 truncate">AI Messages</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 md:gap-4 bg-white/80 border border-surface-variant p-4 rounded-xl md:rounded-2xl shadow-sm min-w-0">
                        <div className="p-2 md:p-2.5 bg-primary/10 rounded-xl shrink-0">
                          <MdHealthAndSafety className="text-primary-dark text-xl" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-2xl md:text-3xl xl:text-4xl font-heading font-extrabold text-primary-dark leading-none truncate">{freeDoctorMessages}</span>
                          <span className="text-xs md:text-sm text-text-muted font-medium mt-1 truncate">Doctor Messages</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Paid Messages Section */}
                  {(paidAiMessages > 0 || paidDoctorMessages > 0) && (
                    <div className="space-y-3 md:space-y-4 w-full lg:w-1/2 xl:w-auto xl:flex-1 lg:pl-8 lg:border-l border-t lg:border-t-0 pt-6 lg:pt-0 border-surface-variant/80">
                      <h4 className="text-xs md:text-sm uppercase tracking-widest text-primary-dark font-bold flex items-center gap-2">
                        <span className="bg-gradient-to-r from-primary to-primary-light text-white p-0.5 md:p-1 rounded shadow-sm flex items-center justify-center">
                          <MdMonetizationOn className="text-xs md:text-sm" />
                        </span>
                        Premium Balance
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div className="flex items-center gap-3 md:gap-4 bg-white/80 border border-surface-variant p-4 rounded-xl md:rounded-2xl shadow-sm min-w-0">
                          <div className="p-2 md:p-2.5 bg-primary/10 rounded-xl shrink-0">
                            <MdSmartToy className="text-primary-dark text-xl" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-2xl md:text-3xl xl:text-4xl font-heading font-extrabold text-primary-dark leading-none truncate">{paidAiMessages}</span>
                            <span className="text-xs md:text-sm text-text-muted font-medium mt-1 truncate">AI Messages</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 md:gap-4 bg-white/80 border border-surface-variant p-4 rounded-xl md:rounded-2xl shadow-sm min-w-0">
                          <div className="p-2 md:p-2.5 bg-primary/10 rounded-xl shrink-0">
                            <MdHealthAndSafety className="text-primary-dark text-xl" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-2xl md:text-3xl xl:text-4xl font-heading font-extrabold text-primary-dark leading-none truncate">{paidDoctorMessages}</span>
                            <span className="text-xs md:text-sm text-text-muted font-medium mt-1 truncate">Doctor Messages</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                <button 
                  onClick={() => navigate("/recharge")}
                  className="cursor-pointer w-full xl:w-auto text-sm md:text-base xl:text-lg bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white px-5 md:px-6 xl:px-8 py-3.5 md:py-4 xl:py-5 rounded-xl md:rounded-2xl font-bold shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2.5 md:gap-3 group shrink-0 self-stretch xl:self-center"
                >
                  <MdAccountBalanceWallet className="text-lg md:text-xl xl:text-2xl group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shrink-0" />
                  <span className="whitespace-nowrap">Boost Your Balance</span>
                </button>
                
              </div>
            )}
              
          </div>
        </section>

        {/* Info Sections */}
        <section className="pt-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-variant to-transparent opacity-50"></div>
          
          <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-5 px-4">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-dark tracking-tight leading-tight">
                Comprehensive Care Ecosystem
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-text-muted font-light leading-relaxed">
                Seamlessly transition from intelligent symptom checking to professional medical consultation in one unified platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              <div className="md:col-span-1 lg:col-span-2 bg-background rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-sm hover:shadow-xl border border-surface-variant/40 relative overflow-hidden group flex flex-col justify-between transition-all duration-500 min-h-[320px]">
                <div className="relative z-10 space-y-5 max-w-lg">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-surface-variant/50 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500">
                    <MdHealthAndSafety className="text-3xl sm:text-4xl" />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
                    Intelligent AI Assessments
                  </h3>
                  <p className="text-text-muted text-base sm:text-lg leading-relaxed">
                    Our advanced AI assesses your symptoms in real-time, asking contextual questions to accurately recommend the appropriate medical department and level of urgency.
                  </p>
                </div>
                
                <div className="absolute -bottom-24 -right-24 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
              </div>

              <div className="col-span-1 bg-surface-variant/20 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-sm hover:shadow-xl border border-surface-variant/40 flex flex-col justify-between transition-all duration-500 group min-h-[320px]">
                <div className="space-y-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center text-primary-dark shadow-sm border border-surface-variant/50 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                    <MdVideoCameraFront className="text-3xl sm:text-4xl" />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
                    Direct Consultations
                  </h3>
                  <p className="text-text-muted text-base sm:text-lg leading-relaxed">
                    Connect with certified doctors via secure video calls, schedule clinic visits, or utilize our continuous chat.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-8">
                  <span className="px-3 sm:px-4 py-2 bg-white rounded-full text-xs sm:text-sm font-semibold text-primary-dark border border-surface-variant/50 shadow-sm flex items-center gap-1.5 transition-colors hover:bg-gray-50">
                    <MdVideocam className="text-base sm:text-lg text-primary" /> Video
                  </span>
                  <span className="px-3 sm:px-4 py-2 bg-white rounded-full text-xs sm:text-sm font-semibold text-primary-dark border border-surface-variant/50 shadow-sm flex items-center gap-1.5 transition-colors hover:bg-gray-50">
                    <MdChat className="text-base sm:text-lg text-primary" /> Chat
                  </span>
                  <span className="px-3 sm:px-4 py-2 bg-white rounded-full text-xs sm:text-sm font-semibold text-primary-dark border border-surface-variant/50 shadow-sm flex items-center gap-1.5 transition-colors hover:bg-gray-50">
                    <MdLocalHospital className="text-base sm:text-lg text-primary" /> Clinic
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 relative bg-primary-dark rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden border border-white/10 group">
                
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-60"></div>
                <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full bg-gradient-to-l from-primary/40 via-primary/10 to-transparent pointer-events-none"></div>
                <div className="absolute -top-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-primary/40 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:bg-primary/50"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-8">
                  
                  <div className="w-full lg:w-1/2 space-y-5 text-center lg:text-left">
                    <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      Accessible <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-light">Healthcare</span>
                    </h3>
                    <p className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-light mx-auto lg:mx-0">
                      We believe in barrier-free care. Enjoy free daily messages before seamlessly topping up your balance for extended consultations.
                    </p>
                  </div>

                  <div className="w-full lg:w-1/2">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <li className="flex items-center justify-center lg:justify-start gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-left">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary-light shrink-0">
                          <MdCheckCircle className="text-2xl" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base sm:text-lg">15 Free AI</span>
                          <span className="text-xs sm:text-sm text-white/60 font-light">Messages Daily</span>
                        </div>
                      </li>
                      
                      <li className="flex items-center justify-center lg:justify-start gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-left">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary-light shrink-0">
                          <MdCheckCircle className="text-2xl" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base sm:text-lg">5 Free Doctor</span>
                          <span className="text-xs sm:text-sm text-white/60 font-light">Messages Daily</span>
                        </div>
                      </li>

                      <li className="flex items-center justify-center lg:justify-start gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors sm:col-span-2 text-center lg:text-left">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary-light shrink-0">
                          <MdAccountBalanceWallet className="text-2xl" />
                        </div>
                        <span className="text-base sm:text-lg">Easy EGP Recharge for Extended Consultations</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-surface-variant">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
            <MdMedicalServices className="text-primary text-3xl" />
            <h2 className="text-xl font-heading font-bold text-primary tracking-tight">Tabibi</h2>
            <p className="text-xs text-text-muted">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
        </div>
      </footer>
    </>
  );
};

export default Hero;