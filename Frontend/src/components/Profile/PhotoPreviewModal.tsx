import React from "react";
import { FiX } from "react-icons/fi";

interface PhotoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  imageUrl: string;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  isOpen,
  onClose,
  label,
  imageUrl,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-[#2A2455]">{label} Preview</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4 flex justify-center bg-gray-50 max-h-[70vh] overflow-auto">
          <img
            src={imageUrl}
            alt={label}
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
