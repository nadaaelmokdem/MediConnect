import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/Home/HeroSection";
import QuotaSection from "../components/Home/QuotaSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import Footer from "../components/Home/Footer";

/** Daily quota constants */
const FREE_AI_MESSAGES = 12;
const FREE_DOCTOR_MESSAGES = 3;
const PAID_AI_MESSAGES = 12;
const PAID_DOCTOR_MESSAGES = 3;

/**
 * Home page — the main landing page of the application.
 * Composed from extracted section components for maintainability.
 */
export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <main className="flex-grow">
        <HeroSection />

        {/* Quota Section (authenticated users only) */}
        {isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <QuotaSection
              freeAiMessages={FREE_AI_MESSAGES}
              freeDoctorMessages={FREE_DOCTOR_MESSAGES}
              paidAiMessages={PAID_AI_MESSAGES}
              paidDoctorMessages={PAID_DOCTOR_MESSAGES}
            />
          </div>
        )}

        <FeaturesSection />
      </main>

      <Footer />
    </>
  );
}
