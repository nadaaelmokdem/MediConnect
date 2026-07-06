import type { StatCardProps } from "../../types/dashboardProps";

export default function StatCard({
  title,
  value,
  subtext,
  trend,
  icon: Icon,
  isPrimary,
  onClick,
}: StatCardProps & { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${isPrimary ? "bg-[#6A5ACD] text-white" : "bg-white border border-[#E6E1FF]"}`}
    >
      <div
        className={`flex justify-between items-start mb-2 ${isPrimary ? "opacity-90" : "text-[#2A2455]/70"}`}
      >
        <span className="text-sm font-medium">{title}</span>
        <div
          className={`p-2 rounded-xl ${isPrimary ? "bg-white/20" : "bg-[#F4F1FF] text-[#6A5ACD]"}`}
        >
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <div
          className={`font-bold ${isPrimary ? "text-4xl" : "text-3xl text-[#2A2455]"}`}
        >
          {value}
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-500">{trend}</span>
        )}
      </div>
      {subtext && (
        <div
          className={`text-xs mt-2 ${isPrimary ? "text-white/80" : "text-gray-400"}`}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
