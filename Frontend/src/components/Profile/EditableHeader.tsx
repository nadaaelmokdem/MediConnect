import { useEffect, useRef, useState } from "react";
import type { EditableHeaderFieldProps } from "../../types/profilePageProps";
import { FiCheck, FiEdit2, FiX } from "react-icons/fi";

export const EditableHeaderField: React.FC<EditableHeaderFieldProps> = ({ value, isEditing, onEdit, onSave, onCancel, textClass, prefix }) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [isEditing, value]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full justify-center sm:justify-start">
        {prefix && <span className="text-2xl">{prefix}</span>}
        <input 
          ref={inputRef}
          type="text" 
          value={localValue} 
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSave(localValue)}
          className={`bg-white border-2 border-[#6A5ACD] rounded-lg px-3 py-1.5 outline-none text-[#2A2455] w-full max-w-[280px] ${textClass?.replace('text-4xl', 'text-2xl').replace('text-3xl', 'text-xl')}`} 
        />
        <button onClick={() => onSave(localValue)} className="p-2.5 bg-[#6A5ACD] text-white rounded-md hover:bg-[#2A2455] transition-colors cursor-pointer">
          <FiCheck size={18} />
        </button>
        <button onClick={onCancel} className="p-2.5 bg-[#E6E1FF] text-[#2A2455] rounded-md hover:bg-[#B8A7FF] transition-colors cursor-pointer">
          <FiX size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 justify-center sm:justify-start w-full">
      <h1 className={`${textClass} truncate max-w-full`}>
        {value}
      </h1>
      <button 
        onClick={onEdit} 
        className="text-[#B8A7FF] hover:text-[#6A5ACD] transition-colors cursor-pointer p-2 rounded-full hover:bg-[#FBFAFF] flex-shrink-0"
        title="Edit"
      >
        <FiEdit2 size={20} />
      </button>
    </div>
  );
};

