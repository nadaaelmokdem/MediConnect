import { useNavigate } from "react-router-dom";
import {
  MdSmartToy,
  MdHealthAndSafety,
  MdAccountBalanceWallet,
  MdMonetizationOn,
} from "react-icons/md";

import type { QuotaSectionProps, QuotaCardProps } from "../../types/props";

/**
 * Displays the user's daily free and premium message quotas.
 * Only rendered for authenticated users.
 */
export default function QuotaSection({
  freeAiMessages,
  freeDoctorMessages,
  paidAiMessages,
  paidDoctorMessages,
}: QuotaSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto bg-surface/60 backdrop-blur-md border border-surface-variant p-5 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-lg flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8 transform transition-all duration-500 mt-2">
      <div className="flex flex-col lg:flex-row xl:flex-1 gap-6 lg:gap-8 w-full">
        {/* Free Quota */}
        <div className="space-y-3 md:space-y-4 w-full lg:w-1/2 xl:w-auto xl:flex-1">
          <h4 className="text-xs md:text-sm uppercase tracking-widest text-text-muted font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Daily Free Quota
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <QuotaCard
              icon={<MdSmartToy />}
              count={freeAiMessages}
              label="AI Messages"
            />
            <QuotaCard
              icon={<MdHealthAndSafety />}
              count={freeDoctorMessages}
              label="Doctor Messages"
            />
          </div>
        </div>

        {/* Premium Balance */}
        {(paidAiMessages > 0 || paidDoctorMessages > 0) && (
          <div className="space-y-3 md:space-y-4 w-full lg:w-1/2 xl:w-auto xl:flex-1 lg:pl-8 lg:border-l border-t lg:border-t-0 pt-6 lg:pt-0 border-surface-variant/80">
            <h4 className="text-xs md:text-sm uppercase tracking-widest text-primary-dark font-bold flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-primary-light text-white p-0.5 md:p-1 rounded shadow-sm flex items-center justify-center">
                <MdMonetizationOn className="text-xs md:text-sm" />
              </span>
              Premium Balance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <QuotaCard
                icon={<MdSmartToy />}
                count={paidAiMessages}
                label="AI Messages"
              />
              <QuotaCard
                icon={<MdHealthAndSafety />}
                count={paidDoctorMessages}
                label="Doctor Messages"
              />
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
  );
}

/* ─── Sub-components ─── */

function QuotaCard({ icon, count, label }: QuotaCardProps) {
  return (
    <div className="flex items-center gap-3 md:gap-4 bg-white/80 border border-surface-variant p-4 rounded-xl md:rounded-2xl shadow-sm min-w-0">
      <div className="p-2 md:p-2.5 bg-primary/10 rounded-xl shrink-0 text-primary-dark text-xl">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-2xl md:text-3xl xl:text-4xl font-heading font-extrabold text-primary-dark leading-none truncate">
          {count}
        </span>
        <span className="text-xs md:text-sm text-text-muted font-medium mt-1 truncate">
          {label}
        </span>
      </div>
    </div>
  );
}
