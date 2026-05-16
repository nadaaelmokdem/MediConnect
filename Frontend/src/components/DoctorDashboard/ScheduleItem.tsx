import { MdDelete, MdVideoCall, MdLocationCity } from 'react-icons/md';

export interface ScheduleItem {
  id: number;
  time: string;
  duration: string;
  name: string;
  type: string;
  badge: string;
  date: string;
  initials: string;
  avatar?: string;
}

export default function ScheduleItemComponent({ item, onCancel }: { item: ScheduleItem; onCancel: (id: number) => void }) {
  return (
    <div className="group flex items-center justify-between p-4 bg-[#F8F7FF] rounded-xl border border-[#E6E1FF] border-l-4 border-l-[#6A5ACD] hover:shadow-md transition-all">
      <div className="flex items-center gap-6">
        <div className="text-center min-w-[60px]">
          <div className="text-[#6A5ACD] font-bold text-sm">{item.time}</div>
          <div className="text-[11px] text-[#6A5ACD]/60 font-medium mt-1">{item.duration}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A2455] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {item.avatar ? <img src={item.avatar} alt={item.name} className="w-full h-full object-cover opacity-80 rounded-full" /> : item.initials}
          </div>
          <div>
            <div className="font-bold text-[#2A2455] text-sm">{item.name}</div>
            <p className="text-[11px] text-gray-500 mt-0.5">{item.type}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white border border-[#E6E1FF] text-[#2A2455]/70 px-3 py-1.5 rounded-lg shadow-sm">
          {item.badge === 'Video' ? <MdVideoCall size={12} className="text-[#6A5ACD]"/> : <MdLocationCity size={12} className="text-[#6A5ACD]"/>}
          {item.badge}
        </span>
        <button onClick={() => onCancel(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all" title="Cancel Appointment"><MdDelete size={16} /></button>
      </div>
    </div>
  );
}
