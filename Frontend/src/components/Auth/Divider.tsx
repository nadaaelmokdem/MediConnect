export default function Divider() {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="h-px bg-[#c9c4d5]/50 flex-grow" />
      <span className="text-[10px] lg:text-[11px] font-medium text-[#787584]">
        OR
      </span>
      <div className="h-px bg-[#c9c4d5]/50 flex-grow" />
    </div>
  );
}
