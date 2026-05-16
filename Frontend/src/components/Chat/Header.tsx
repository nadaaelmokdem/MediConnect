import { FiMenu } from 'react-icons/fi';
import { MdOutlineAccountBalanceWallet, MdSmartToy } from 'react-icons/md';
import type Contact from '../../types/Contact';

export default function ChatHeader({ contact, onOpenSidebar }: { contact: Contact; onOpenSidebar: () => void }) {
  return (
    <header className="bg-[#ffffff] border-b border-[#e5deff] px-4 sm:px-[24px] py-[12px] sm:py-[16px] flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shrink-0 shadow-[0px_4px_20px_rgba(42,36,85,0.05)] z-10">
      <div className="flex items-center gap-[12px]">
        <button
          className="cursor-pointer lg:hidden p-2 -ml-2 text-[#474553] hover:text-[#5140b3] hover:bg-[#eae5ff] rounded-lg transition-colors"
          onClick={onOpenSidebar}
        >
          <FiMenu className="text-[24px]" />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#6a5acd] flex items-center justify-center text-[#f0ebff] shrink-0 hidden sm:flex">
          <MdSmartToy className="text-[20px]" />
        </div>
        <div>
          <h2 className="text-[18px] sm:text-[24px] leading-[1.4] font-semibold text-[#1a1345] line-clamp-1">
            {contact.name}
          </h2>
          <div className="flex items-center gap-[4px]">
            <div className="w-2 h-2 rounded-full bg-[#b8a7ff]"></div>
            <span className="text-[12px] leading-[1] font-medium text-[#474553]">Active Session</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 sm:flex-none items-center justify-end sm:justify-start gap-3 sm:gap-6 bg-[#FBFAFF] border border-[#E6E1FF] px-3 sm:px-5 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm w-full sm:w-fit">
        <div className="hidden lg:flex items-center gap-2">
          <MdOutlineAccountBalanceWallet className="text-[18px] text-[#474553]" />
          <p className="text-sm text-[#474553]">Message usage</p>
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-24 md:w-32">
          <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-[#2A2455] uppercase tracking-wide">
            <span>AI</span><span>5/15</span>
          </div>
          <div className="h-1.5 sm:h-2 w-full bg-[#E6E1FF] rounded-full overflow-hidden">
            <div className="h-full bg-[#6A5ACD] rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-24 md:w-32">
          <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-[#2A2455] uppercase tracking-wide">
            <span>Doc</span><span>2/5</span>
          </div>
          <div className="h-1.5 sm:h-2 w-full bg-[#E6E1FF] rounded-full overflow-hidden">
            <div className="h-full bg-[#2A2455] rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    </header>
  );
}