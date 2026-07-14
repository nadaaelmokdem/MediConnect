import type { SecondaryButtonProps } from "../../types/props";

export default function SecondaryButton({
  onClick,
  disabled,
  children,
}: SecondaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-11 lg:h-11.5 flex items-center justify-center gap-3 bg-white/90 backdrop-blur-sm border border-surface-variant hover:bg-surface-container hover:border-outline-variant rounded-full text-[13px] font-semibold text-on-surface transition-all ${
        disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      }`}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
