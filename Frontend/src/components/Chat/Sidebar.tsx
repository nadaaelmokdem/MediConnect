import { FiX } from 'react-icons/fi';
import { MdSmartToy } from 'react-icons/md';
import { FaStethoscope } from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {isOpen && (
        <div
          className="absolute inset-0 bg-[#1a1345]/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          absolute lg:relative z-50 left-0 top-0 bottom-0
          w-[85%] sm:w-80 border-r border-[#e5deff] bg-[#ffffff] flex flex-col h-[calc(100dvh-70px)]
          transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-[#e5deff]">
          <span className="font-semibold text-[#1a1345] text-[18px]">Menu</span>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 text-[#474553] hover:bg-[#eae5ff] hover:text-[#5140b3] rounded-lg transition-colors"
          >
            <FiX className="text-[20px]" />
          </button>
        </div>

        <div className="p-4 lg:p-[24px] border-b border-t border-[#e5deff] flex flex-col gap-[12px]">
          <button
            className="cursor-pointer w-full bg-[#6a5acd] text-[#f0ebff] rounded-lg px-[16px] py-[12px] flex items-center justify-center gap-[4px] text-[14px] leading-[1] tracking-[0.02em] font-semibold hover:bg-[#5140b3] hover:text-[#ffffff] transition-colors shadow-[0px_4px_20px_rgba(42,36,85,0.05)]"
            onClick={onClose}
          >
            <MdSmartToy className="text-[18px]" />
            New AI Chat
          </button>
          <button
            className="cursor-pointer w-full bg-[#eae5ff] text-[#1a1345] rounded-lg px-[16px] py-[12px] flex items-center justify-center gap-[4px] text-[14px] leading-[1] tracking-[0.02em] font-semibold hover:bg-[#e5deff] transition-colors"
            onClick={onClose}
          >
            <FaStethoscope className="text-[18px]" />
            New Doctor Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-[16px] flex flex-col gap-[12px]">
          <p className="text-[12px] leading-[1] font-medium text-[#474553] px-[4px] uppercase tracking-wider">
            Recent Consultations
          </p>
          <div className="bg-[#eae5ff] rounded-lg p-[12px] cursor-pointer border-l-4 border-[#5140b3]">
            <div className="flex items-center gap-[4px] mb-[4px]">
              <MdSmartToy className="text-[#5140b3] text-[18px]" />
              <span className="p-1 text-[14px] leading-[1] tracking-[0.02em] font-semibold text-[#1a1345] line-clamp-1">Migraine Assessment</span>
            </div>
            <p className="p-1 text-[14px] leading-[1.5] font-normal text-[#474553] line-clamp-1">Based on the visual aura symptoms...</p>
            <p className="p-1 text-[12px] leading-[1] font-medium text-[#787584] mt-[4px] text-right">Today, 10:42 AM</p>
          </div>
        </div>
      </aside>
    </>
  );
}