interface RequestItem {
  id: number;
  name: string;
  time: string;
  timeDisplay: string;
  concern: string;
  initials: string;
}

export default function RequestItemComponent({ req, onAccept, onReschedule }: { req: RequestItem; onAccept: (req: RequestItem) => void; onReschedule: (id: number) => void }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-[#E6E1FF] mb-4 hover:shadow-sm transition-all">
      <div className="flex justify-between items-start mb-1">
        <div className="font-bold text-sm text-[#2A2455]">{req.name}</div>
        <div className="text-[11px] font-medium text-[#2A2455]/60">
          {req.timeDisplay}
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4">{req.concern}</p>
      <div className="flex gap-2">
        <button onClick={() => onAccept(req)} className="flex-1 bg-[#6A5ACD] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#5849B3] transition shadow-sm">Accept</button>
        <button onClick={() => onReschedule(req.id)} className="flex-1 bg-[#F8F7FF] text-[#6A5ACD] border border-[#E6E1FF] py-2 rounded-lg text-xs font-bold hover:bg-[#E6E1FF] transition">Reschedule</button>
      </div>
    </div>
  );
}
