import {
  MdHealthAndSafety,
  MdVideoCameraFront,
  MdVideocam,
  MdChat,
  MdLocalHospital,
  MdCheckCircle,
  MdAccountBalanceWallet,
} from "react-icons/md";

/**
 * Features section showcasing the platform's key capabilities:
 * AI Assessments, Direct Consultations, and Accessible Healthcare.
 */
export default function FeaturesSection() {
  return (
    <section className="pt-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-variant to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 px-4">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-dark tracking-tight leading-tight">
            Comprehensive Care Ecosystem
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-muted font-light leading-relaxed">
            Seamlessly transition from intelligent symptom checking to
            professional medical consultation in one unified platform.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* AI Assessments Card */}
          <AIAssessmentsCard />

          {/* Direct Consultations Card */}
          <ConsultationsCard />

          {/* Accessible Healthcare Banner */}
          <AccessibleHealthcareBanner />
        </div>
      </div>
    </section>
  );
}

/* ─── Feature Cards ─── */

function AIAssessmentsCard() {
  return (
    <div className="md:col-span-1 lg:col-span-2 bg-background rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-sm hover:shadow-xl border border-surface-variant/40 relative overflow-hidden group flex flex-col justify-between transition-all duration-500 min-h-[320px]">
      <div className="relative z-10 space-y-5 max-w-lg">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-surface-variant/50 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500">
          <MdHealthAndSafety className="text-3xl sm:text-4xl" />
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Intelligent AI Assessments
        </h3>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Our advanced AI assesses your symptoms in real-time, asking contextual
          questions to accurately recommend the appropriate medical department
          and level of urgency.
        </p>
      </div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />
    </div>
  );
}

function ConsultationsCard() {
  return (
    <div className="col-span-1 bg-surface-variant/20 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-sm hover:shadow-xl border border-surface-variant/40 flex flex-col justify-between transition-all duration-500 group min-h-[320px]">
      <div className="space-y-5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center text-primary-dark shadow-sm border border-surface-variant/50 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
          <MdVideoCameraFront className="text-3xl sm:text-4xl" />
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Direct Consultations
        </h3>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Connect with certified doctors via secure video calls, schedule clinic
          visits, or utilize our continuous chat.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 mt-8">
        <ConsultationBadge icon={<MdVideocam />} label="Video" />
        <ConsultationBadge icon={<MdChat />} label="Chat" />
        <ConsultationBadge icon={<MdLocalHospital />} label="Clinic" />
      </div>
    </div>
  );
}

function ConsultationBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="px-3 sm:px-4 py-2 bg-white rounded-full text-xs sm:text-sm font-semibold text-primary-dark border border-surface-variant/50 shadow-sm flex items-center gap-1.5 transition-colors hover:bg-gray-50">
      <span className="text-base sm:text-lg text-primary">{icon}</span>
      {label}
    </span>
  );
}

function AccessibleHealthcareBanner() {
  return (
    <div className="md:col-span-2 lg:col-span-3 relative bg-primary-dark rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden border border-white/10 group">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-60" />
      <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full bg-gradient-to-l from-primary/40 via-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 bg-primary/40 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:bg-primary/50" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-8">
        <div className="w-full lg:w-1/2 space-y-5 text-center lg:text-left">
          <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Accessible{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-light">
              Healthcare
            </span>
          </h3>
          <p className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-light mx-auto lg:mx-0">
            We believe in barrier-free care. Enjoy free daily messages before
            seamlessly topping up your balance for extended consultations.
          </p>
        </div>

        <div className="w-full lg:w-1/2">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BenefitItem
              icon={<MdCheckCircle />}
              title="15 Free AI"
              subtitle="Messages Daily"
            />
            <BenefitItem
              icon={<MdCheckCircle />}
              title="5 Free Doctor"
              subtitle="Messages Daily"
            />
            <li className="flex items-center justify-center lg:justify-start gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors sm:col-span-2 text-center lg:text-left">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary-light shrink-0">
                <MdAccountBalanceWallet className="text-2xl" />
              </div>
              <span className="text-base sm:text-lg">
                Easy EGP Recharge for Extended Consultations
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <li className="flex items-center justify-center lg:justify-start gap-4 text-white font-medium bg-white/5 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-left">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary-light shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-base sm:text-lg">{title}</span>
        <span className="text-xs sm:text-sm text-white/60 font-light">
          {subtitle}
        </span>
      </div>
    </li>
  );
}
