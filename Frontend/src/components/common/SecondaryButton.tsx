import type { SecondaryButtonProps } from "../../types/props";

export default function SecondaryButton({
  onClick,
  disabled,
  children,
}: SecondaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-11 lg:h-11.5 flex items-center justify-center gap-3 bg-[#ffffff]/90 backdrop-blur-sm border border-[#e5deff] hover:bg-[#f0ebff] hover:border-[#c9c4d5] rounded-full text-[13px] font-semibold text-[#1a1345] transition-all ${
        disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      }`}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
