import { MdMedicalServices } from "react-icons/md";
import type { BrandHeaderProps } from "../../types/props";

export default function BrandHeader({
  size = "large",
  title,
  subtitle,
  onNavigateHome,
}: BrandHeaderProps) {
  const isLarge = size === "large";

  return (
    <div
      className={`flex flex-col items-center lg:items-start text-center lg:text-left ${isLarge ? "gap-2" : "gap-0.5"}`}
    >
      <button
        type="button"
        className="flex items-center gap-2 text-[#5140b3] cursor-pointer"
        onClick={onNavigateHome}
      >
        <MdMedicalServices
          className={isLarge ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"}
        />
        <span
          className={`font-bold tracking-tight text-[#5140b3] ${
            isLarge
              ? "text-[28px] leading-[36px] lg:text-[40px] lg:leading-[48px]"
              : "text-[24px] leading-[32px] lg:text-[32px] lg:leading-[40px]"
          }`}
        >
          Tabibi
        </span>
      </button>
      <div
        className={`flex flex-col ${isLarge ? "gap-1 mt-1 lg:mt-2" : "gap-0"}`}
      >
        <h1
          className={`font-bold text-[#1a1345] ${
            isLarge
              ? "text-[24px] leading-[32px] lg:text-[28px] lg:leading-[36px]"
              : "text-[20px] leading-[28px] lg:text-[24px] lg:leading-[32px]"
          }`}
        >
          {title}
        </h1>
        <p
          className={`font-normal text-[#474553] ${
            isLarge
              ? "text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]"
              : "text-[13px] leading-[18px] lg:text-[14px] lg:leading-[20px]"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
