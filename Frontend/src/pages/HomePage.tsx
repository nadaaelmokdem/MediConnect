import { 
  MdSmartToy,
  MdCheckCircle, 
  MdHealthAndSafety, 
  MdVideoCameraFront, 
  MdVideocam, 
  MdChat, 
  MdLocalHospital, 
  MdAccountBalanceWallet,
  MdMedicalServices
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
  return (
    <>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-5 px-4 md:px-8 overflow-hidden">
          
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 relative z-10">
              
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-dark leading-[1.1] tracking-tight">
                Smart Medical Care,<br/>
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">Instantly.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-text-muted max-w-xl leading-relaxed font-light">
                Experience the future of healthcare. Get immediate AI assessments or connect directly with top medical professionals from anywhere, at any time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10 animate-blob animation-delay-2000"></div>
                <button className="cursor-pointer bg-primary text-white px-8 py-4 rounded-full font-semibold shadow-floating hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3 group hover:-translate-y-1"
                onClick={() => navigate("/ai-chat")}>
                  <MdSmartToy className="text-xl transition-transform group-hover:scale-110" />
                  Chat with AI
                </button>
                <button className="cursor-pointer bg-surface text-primary-dark border border-surface-variant px-8 py-4 rounded-full font-semibold hover:bg-surface-variant transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group hover:-translate-y-1">
                  <MdHealthAndSafety className="text-primary text-xl transition-transform group-hover:scale-110" />
                  Find a Doctor
                </button>
              </div>
              
              <div className="flex items-center gap-4 pt-8 border-t border-surface-variant max-w-md">
                <div className="flex -space-x-3">
                  <img alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLpa4I6hpL_sRwzIoFWIRnDjT7YpDzDz3ov5piXfPu57k9qziNl536mYj6bBjECLAPRT00APH9g_YFENId15DwkM1dBBczW8w5JujUZ00ZfmW48kPuI41-ERadxNWSopJ0YjSExnSH8Qv5dUPpIIK7EsNJDByvAuLC4HThuZdO91tAqs0NODu0kRjhEILu4FoyI5G39BUffyfGPGFWoAl6rz_W6ydyyt376QDxzxCbvArEMsZMLQxW2kctP92YsFBsr43hNVUHviU"/>
                  <img alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIaDjS4ZSBPBeWo0iNtB740AEuWyxHXsnhwZ0T4BXkd3GlyTpXsYt9Zdqa7qpxTz7nKNXFQSIJVkAO8wZ9F62z6xE80P8dEM95zOVGGqxCNvvp8LG-uIWc5cC55GjOC2xrmCsTA7EZFi8VGD4Q_hqXCQUSdInDhEQgVQNnIhFQbNc2ASlLVSjDOcBOzZoEAKAscRsB9r-YN6l4jeuEqCH1SxBYm1PvG82Nde02Zvg8VO3moXe_ee9KQo03BcTSAdjKnF4G1mrhOic"/>
                  <img alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATG-OJlhz33cDgITR2jZsw-BY9iGcAZ3EBedpXh2pkCZQPnl4p5Kii198hfVdODV3zs8Ca_lkRuUDuGm7WLcoSc4e-J8iIekLspG5U-wbAm3jeCYJPWhDYbt9GYgPoSvJe1ncmdC5k01VX_aYT2ovJyhKX0e9HirAky0vFCIgzekZjtDo3M5z4TmFyBeGphpftuBCjDMntUL7Mgjxb30SNxcgpjSnZHeD_UTb7seLWrv85jhPpvuXeTEuW5NweaDVxfipWIeecvvo"/>
                </div>
                <p className="text-sm text-text-muted">Trusted by <span className="font-semibold text-primary-dark">10,000+</span> patients daily</p>
              </div>
            </div>
            
            <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[650px] rounded-[2.5rem] overflow-hidden shadow-floating backdrop-blur-sm">
              <img alt="Doctor using a tablet in a modern, brightly lit clinical setting" className="absolute inset-0 w-full h-full object-cover" data-alt="Modern female doctor in a white coat looking thoughtfully at a digital tablet in a bright, clean medical office with soft natural lighting and subtle lavender accents." src="/doctor-hero.jpg"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent"></div>
              
              {/* Floating UI Card */}
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-5 rounded-2xl shadow-floating flex items-center gap-5 transform transition-transform hover:scale-[1.02] cursor-default border border-white/40">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MdCheckCircle className="text-3xl" />
                </div>
                <div>
                  <p className="font-semibold text-primary-dark text-lg">AI Assessment Complete</p>
                  <p className="text-sm text-text-muted mt-1">Recommended Action: <span className="text-primary font-medium">General Practice</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Top subtle gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-variant to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5 px-4">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-dark tracking-tight leading-tight">
            Comprehensive Care Ecosystem
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-muted font-light leading-relaxed">
            Seamlessly transition from intelligent symptom checking to professional medical consultation in one unified platform.
          </p>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Feature 1: AI Triage (Spans 2 columns on tablet/desktop) */}
          <div className="md:col-span-2 bg-background rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-sm hover:shadow-xl border border-surface-variant/40 relative overflow-hidden group flex flex-col justify-between transition-all duration-500 min-h-[320px]">
            <div className="relative z-10 space-y-5 max-w-lg">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-surface-variant/50 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500">
                <MdHealthAndSafety className="text-3xl sm:text-4xl" />
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
                Intelligent AI Assements
              </h3>
              <p className="text-text-muted text-base sm:text-lg leading-relaxed">
                Our advanced AI assesses your symptoms in real-time, asking contextual questions to accurately recommend the appropriate medical department and level of urgency.
              </p>
            </div>
            
            {/* Abstract Decorative Background */}
            <div className="absolute -bottom-24 -right-24 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
          </div>

          {/* Feature 2: Direct Consultations (1 column) */}
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
            
            {/* Badges */}
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

          {/* Feature 3: Pricing/Accessibility (Spans full width) */}
          <div className="md:col-span-2 lg:col-span-3 relative bg-primary-dark rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden border border-white/10 group">
            
            {/* --- Background Decorations --- */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-60"></div>
            <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full bg-gradient-to-l from-primary/40 via-primary/10 to-transparent pointer-events-none"></div>
            <div className="absolute -top-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-primary/40 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:bg-primary/50"></div>

            {/* --- Content Wrapper --- */}
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-8">
              
              {/* Left Side: Text */}
              <div className="w-full lg:w-1/2 space-y-5">
                <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Accessible <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-light">Healthcare</span>
                </h3>
                <p className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-light">
                  We believe in barrier-free care. Enjoy free daily messages before seamlessly topping up your balance for extended consultations.
                </p>
              </div>

              {/* Right Side: Feature List */}
              <div className="w-full lg:w-1/2">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <li className="flex items-center gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary-light shrink-0">
                      <MdCheckCircle className="text-2xl" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg">15 Free AI</span>
                      <span className="text-xs sm:text-sm text-white/60 font-light">Messages Daily</span>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary-light shrink-0">
                      <MdCheckCircle className="text-2xl" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg">5 Free Doctor</span>
                      <span className="text-xs sm:text-sm text-white/60 font-light">Messages Daily</span>
                    </div>
                  </li>

                  <li className="flex items-center gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors sm:col-span-2">
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
            
            {/* Brand Section */}
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