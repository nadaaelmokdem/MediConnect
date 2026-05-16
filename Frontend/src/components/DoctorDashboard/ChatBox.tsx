import { MdClose, MdCall, MdVideoCall, MdSend, MdMoreVert } from 'react-icons/md';

interface ChatMessage {
  id: number;
  name: string;
  text: string;
  time: string;
  initials: string;
  isOnline: boolean;
}

export default function ChatBox({ activeChat, onClose }: { activeChat: ChatMessage | null; onClose: () => void }) {
  if (!activeChat) return null;

  return (
    <div className="fixed bottom-4 right-4 md:right-8 w-80 bg-white rounded-t-2xl rounded-b-lg shadow-2xl border border-gray-200 z-[999] flex flex-col h-[400px] animate-in slide-in-from-bottom-10">
      <div className="bg-[#6A5ACD] text-white p-3 rounded-t-2xl flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">{activeChat.initials}</div>
            {activeChat.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#6A5ACD] rounded-full"></div>}
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">{activeChat.name}</div>
            <div className="text-[10px] text-white/80">{activeChat.isOnline ? 'Active Now' : 'Offline'}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/20 rounded-lg transition"><MdCall size={14} /></button>
          <button className="p-1.5 hover:bg-white/20 rounded-lg transition"><MdVideoCall size={14} /></button>
          <button onClick={onClose} className="p-1.5 hover:bg-red-500 rounded-lg transition ml-1"><MdClose size={16} /></button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-[#FBFAFF] flex flex-col gap-3">
        <div className="text-center text-[10px] text-gray-400 my-2">{activeChat.time}</div>
        <div className="flex gap-2 max-w-[85%]">
          <div className="w-6 h-6 rounded-full bg-[#E6E1FF] text-[#6A5ACD] flex items-center justify-center font-bold text-[10px] shrink-0">{activeChat.initials}</div>
          <div className="bg-white border border-[#E6E1FF] p-2.5 rounded-2xl rounded-tl-sm text-xs text-[#2A2455] shadow-sm">
            {activeChat.text}
          </div>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 rounded-b-lg">
        <button className="text-gray-400 hover:text-[#6A5ACD]"><MdMoreVert size={18}/></button>
        <input type="text" placeholder="Type a message..." className="flex-1 bg-[#F8F7FF] border-none rounded-full px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-[#6A5ACD]"/>
        <button className="text-white bg-[#6A5ACD] p-2 rounded-full hover:bg-[#5849B3] transition shadow-sm"><MdSend size={14}/></button>
      </div>
    </div>
  );
}
