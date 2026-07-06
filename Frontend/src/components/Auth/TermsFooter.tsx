import type { TermsFooterProps } from "../../types/props";

export default function TermsFooter({
  actionText = "continuing",
}: TermsFooterProps) {
  return (
    <p className="text-[10px] lg:text-[11px] leading-[14px] font-medium text-center text-[#787584] mt-0.5">
      By {actionText}, you agree to Tabibi's{" "}
      <span className="text-[#5140b3] cursor-pointer">Terms of Service</span>{" "}
      and <span className="text-[#5140b3] cursor-pointer">Privacy Policy</span>.
    </p>
  );
}
