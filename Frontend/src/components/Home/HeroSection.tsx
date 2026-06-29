import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdSmartToy,
  MdCheckCircle,
  MdHealthAndSafety,
  MdDashboard,
  MdArrowForward,
  MdLock,
  MdBolt,
} from "react-icons/md";

/**
 * Hero section of the home page.
 * Shows different CTAs depending on authentication state.
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-4 pb-8 lg:pt-8 lg:pb-12 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Text Content */}
          <div className="space-y-8 md:space-y-10 relative z-10 flex flex-col justify-center py-4 lg:py-6 items-center text-center md:items-start md:text-left w-full">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-dark leading-[1.1] tracking-tight">
              Smart Medical Care,
              <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                Instantly.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-muted max-w-xl leading-relaxed font-light mx-auto md:mx-0">
              Experience the future of healthcare. Get immediate AI assessments
              or connect directly with top medical professionals from anywhere,
              at any time.
            </p>

            {/* CTA Area */}
            <div className="pt-2 relative flex flex-col items-center md:items-start w-full">
              <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10 animate-blob animation-delay-2000" />

              {isAuthenticated ? (
                <AuthenticatedCTAs navigate={navigate} />
              ) : (
                <GuestCTAs navigate={navigate} />
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-[400px] md:h-full min-h-[400px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-floating backdrop-blur-sm mt-8 md:mt-0">
            <img
              alt="Doctor using a tablet in a modern, brightly lit clinical setting"
              className="absolute inset-0 w-full h-full object-cover"
              src="/doctor-hero.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 glass-panel p-4 md:p-5 rounded-2xl shadow-floating flex items-center gap-4 md:gap-5 transform transition-transform hover:scale-[1.02] cursor-default border border-white/40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MdCheckCircle className="text-2xl md:text-3xl" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary-dark text-base md:text-lg">
                  AI Assessment Complete
                </p>
                <p className="text-xs md:text-sm text-text-muted mt-1">
                  Recommended Action:{" "}
                  <span className="text-primary font-medium">
                    General Practice
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Sub-components ─── */

function AuthenticatedCTAs({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="flex flex-col gap-4 max-w-xl w-full mx-auto md:mx-0">
      <button
        className="w-full cursor-pointer bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3.5 sm:py-4 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group overflow-hidden relative"
        onClick={() => navigate("/find-doctor")}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-white/20 p-1.5 rounded-full">
            <MdDashboard className="text-xl" />
          </div>
          <span className="text-base md:text-xl">Open Dashboard</span>
        </div>
        <MdArrowForward className="text-xl relative z-10 transition-transform group-hover:translate-x-1" />
      </button>

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
  );
}

function GuestCTAs({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
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

      {/* Info badges */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 pt-2 text-xs md:text-sm text-text-muted font-medium w-full">
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <MdCheckCircle className="text-primary text-base shrink-0" /> Free
          daily assessment credits
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <MdBolt className="text-primary text-base shrink-0" /> No sign-up
          required to start
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <MdLock className="text-primary text-base shrink-0" /> Secure &
          private
        </span>
      </div>
    </div>
  );
}
