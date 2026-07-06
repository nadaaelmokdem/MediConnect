import React from "react";
import { FiX } from "react-icons/fi";

interface TagsInputProps {
  value: string;
  onChange: (value: string) => void;
  tagOptions?: string[];
}

export const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onChange,
  tagOptions,
}) => {
  const currentTags = value
    ? value.split(",").map((t) => t.trim()).filter((t) => t !== "")
    : [];

  const handleAddTag = (newTag: string) => {
    if (newTag && !currentTags.includes(newTag)) {
      onChange([...currentTags, newTag].join(", "));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(currentTags.filter((t) => t !== tagToRemove).join(", "));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {currentTags.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 bg-[#F3F0FF] text-[#6A5ACD] px-2 py-1 rounded-md text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-[#6A5ACD] hover:text-red-500 cursor-pointer"
            >
              <FiX size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        {tagOptions ? (
          <select
            className="w-full bg-[#FBFAFF] border border-[#6A5ACD] rounded px-2 py-1 text-sm font-medium text-[#2A2455] focus:outline-none cursor-pointer"
            onChange={(e) => {
              if (e.target.value) {
                handleAddTag(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Select to add</option>
            {tagOptions.map((opt) => {
              if (currentTags.includes(opt)) return null;
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            })}
          </select>
        ) : (
          <>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                  handleAddTag(e.currentTarget.value.trim());
                  e.currentTarget.value = "";
                }
              }}
              className="w-full bg-[#FBFAFF] border border-[#6A5ACD] rounded px-2 py-1 text-sm font-medium text-[#2A2455] focus:outline-none"
              placeholder="Type and press Enter to add"
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value.trim() !== "") {
                  handleAddTag(input.value.trim());
                  input.value = "";
                }
              }}
              className="p-1.5 bg-[#6A5ACD] text-white rounded hover:bg-[#2A2455] text-sm whitespace-nowrap cursor-pointer"
            >
              Add
            </button>
          </>
        )}
      </div>
    </div>
  );
};
