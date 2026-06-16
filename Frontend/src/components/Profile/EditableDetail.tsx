import { useEffect, useRef, useState } from "react";
import type { EditableDetailItemProps } from "../../types/profilePageProps";
import { FiCheck, FiEdit2, FiX } from "react-icons/fi";

export const EditableDetailItem: React.FC<EditableDetailItemProps> = ({ icon, label, value, isEditing, onEdit, onSave, onCancel, type = "text" }) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [isEditing, value]);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E1FF] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 sm:p-4 bg-[#FBFAFF] border border-[#E6E1FF] text-[#6A5ACD] rounded-lg flex-shrink-0 text-xl sm:text-2xl">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-[#B8A7FF] font-bold tracking-wide uppercase mb-1">{label}</p>
        
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              ref={inputRef}
              type={type}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSave(localValue)}
              className="w-full bg-[#FBFAFF] border-2 border-[#6A5ACD] rounded-md px-3 py-2 text-base focus:outline-none text-[#2A2455] font-medium"
              placeholder={`Enter ${label?.toLowerCase()}`}
            />
            <button onClick={() => onSave(localValue)} className="p-2.5 bg-[#6A5ACD] text-white rounded-md hover:bg-[#2A2455] cursor-pointer">
              <FiCheck size={18} />
            </button>
            <button onClick={onCancel} className="p-2.5 bg-[#E6E1FF] text-[#2A2455] rounded-md hover:bg-[#B8A7FF] cursor-pointer">
              <FiX size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="truncate">
              {value ? (
                <p className="text-base sm:text-lg font-bold text-[#2A2455] truncate">{value}</p>
              ) : (
                <p className="text-base sm:text-lg font-medium text-[#B8A7FF] italic">
                  No Data
                </p>
              )}
            </div>
            
            <button 
              onClick={onEdit}
              className="text-[#B8A7FF] hover:text-[#6A5ACD] p-2 rounded-md bg-[#FBFAFF] border border-[#E6E1FF] hover:bg-[#E6E1FF] transition-all cursor-pointer flex-shrink-0"
              title={`Edit ${label}`}
            >
              <FiEdit2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
