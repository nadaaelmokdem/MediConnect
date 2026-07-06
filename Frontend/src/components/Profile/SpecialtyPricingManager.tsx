import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSave, FiX } from "react-icons/fi";

export interface SpecialtyWithPrices {
  specialtyName: string;
  clinicPrice: number;
  isClinicEnabled: boolean;
  chatPrice: number;
  isChatEnabled: boolean;
  videoPrice: number;
  isVideoEnabled: boolean;
  callPrice: number;
  isCallEnabled: boolean;
}

interface Props {
  initialSpecialties: SpecialtyWithPrices[];
  availableSpecialties: string[];
  onSave: (specialties: SpecialtyWithPrices[]) => Promise<void>;
  disabled?: boolean;
}

export const SpecialtyPricingManager: React.FC<Props> = ({
  initialSpecialties,
  availableSpecialties,
  onSave,
  disabled,
}) => {
  const [specialties, setSpecialties] = useState<SpecialtyWithPrices[]>(
    initialSpecialties
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setSpecialties(initialSpecialties);
    }
  }, [initialSpecialties, isEditing]);

  const handleAdd = () => {
    if (availableSpecialties.length === 0) return;
    setSpecialties([
      ...specialties,
      {
        specialtyName: availableSpecialties[0],
        clinicPrice: 300,
        isClinicEnabled: true,
        chatPrice: 100,
        isChatEnabled: true,
        videoPrice: 200,
        isVideoEnabled: true,
        callPrice: 150,
        isCallEnabled: true,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof SpecialtyWithPrices,
    value: string | number | boolean
  ) => {
    const updated = [...specialties];
    if (field === "specialtyName") {
      updated[index][field] = value as string;
    } else if (typeof value === "boolean") {
      updated[index][field] = value as never;
    } else {
      const numValue = Number(value);
      updated[index][field] = (numValue < 0 ? 0 : numValue) as never;
    }
    setSpecialties(updated);
  };

  const handleSave = async () => {
    // Validate
    if (specialties.some((s) => !s.specialtyName)) {
      setError("Specialty name cannot be empty.");
      return;
    }
    for (const s of specialties) {
      if (
        s.chatPrice > s.clinicPrice ||
        s.videoPrice > s.clinicPrice ||
        s.callPrice > s.clinicPrice
      ) {
        setError(
          `For ${s.specialtyName}, remote prices cannot exceed clinic price (${s.clinicPrice}).`
        );
        return;
      }
    }
    
    setError(null);
    setIsSaving(true);
    try {
      await onSave(specialties);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save specialties.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg border border-[#E6E1FF] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#6A5ACD] font-bold">Specialties & Pricing</h3>
          {!disabled && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm bg-[#E6E1FF] text-[#2A2455] px-3 py-1 rounded hover:bg-[#B8A7FF] transition-colors cursor-pointer"
            >
              {specialties.length === 0 ? "Add Specialties" : "Edit Specialties"}
            </button>
          )}
        </div>
        {specialties.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 my-2">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Please add your specialties and prices, keep remote prices lower than clinic prices. Disabling a consultation type may result in less work.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {specialties.map((s, i) => (
              <div key={i} className="border-l-4 border-[#6A5ACD] pl-3">
                <p className="font-bold text-[#2A2455]">{s.specialtyName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className={`flex flex-col items-start px-3 py-1.5 rounded-md border ${s.isClinicEnabled ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">Clinic</span>
                    <span className="text-sm font-semibold">{s.isClinicEnabled ? `${s.clinicPrice} EGP` : 'Disabled'}</span>
                  </div>
                  <div className={`flex flex-col items-start px-3 py-1.5 rounded-md border ${s.isChatEnabled ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">Chat</span>
                    <span className="text-sm font-semibold">{s.isChatEnabled ? `${s.chatPrice} EGP` : 'Disabled'}</span>
                  </div>
                  <div className={`flex flex-col items-start px-3 py-1.5 rounded-md border ${s.isVideoEnabled ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">Video</span>
                    <span className="text-sm font-semibold">{s.isVideoEnabled ? `${s.videoPrice} EGP` : 'Disabled'}</span>
                  </div>
                  <div className={`flex flex-col items-start px-3 py-1.5 rounded-md border ${s.isCallEnabled ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">Call</span>
                    <span className="text-sm font-semibold">{s.isCallEnabled ? `${s.callPrice} EGP` : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#FBFAFF] p-4 rounded-lg border-2 border-[#B8A7FF] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#6A5ACD] font-bold">
          {initialSpecialties.length === 0 ? "Add Specialties & Pricing" : "Edit Specialties & Pricing"}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditing(false);
              setError(null);
              setSpecialties(initialSpecialties);
            }}
            className="p-1.5 bg-[#E6E1FF] text-[#2A2455] rounded hover:bg-[#B8A7FF] cursor-pointer"
            title="Cancel"
          >
            <FiX size={18} />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-1.5 bg-[#6A5ACD] text-white rounded hover:bg-[#2A2455] disabled:opacity-50 cursor-pointer"
            title="Save"
          >
            <FiSave size={18} />
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded">
        <p className="text-xs text-yellow-800 font-medium">
          Disabling a consultation type may result in less work.
        </p>
      </div>

      <div className="space-y-4">
        {specialties.map((spec, i) => (
          <div key={i} className="bg-white p-3 rounded border border-[#E6E1FF] relative">
            <button
              onClick={() => handleRemove(i)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 cursor-pointer"
              title="Remove"
            >
              <FiTrash2 />
            </button>
            <div className="mb-3 pr-6">
              <label className="block text-xs font-bold text-[#B8A7FF] mb-1">Specialty</label>
              <select
                value={spec.specialtyName}
                onChange={(e) => handleChange(i, "specialtyName", e.target.value)}
                className="w-full bg-[#FBFAFF] border border-[#6A5ACD] rounded px-2 py-1 text-sm font-semibold text-[#2A2455] focus:outline-none cursor-pointer"
              >
                {availableSpecialties.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={spec.isClinicEnabled ?? true} onChange={(e) => handleChange(i, "isClinicEnabled", e.target.checked)} className="w-4 h-4 cursor-pointer text-[#6A5ACD] accent-[#6A5ACD]" />
                    <span className="block text-xs font-bold text-[#B8A7FF]">Clinic</span>
                  </label>
                </div>
                {spec.isClinicEnabled !== false && (
                  <input
                    type="number"
                    min="0"
                    value={spec.clinicPrice}
                    onChange={(e) => handleChange(i, "clinicPrice", e.target.value)}
                    placeholder="EGP"
                    className="w-full bg-[#FBFAFF] border border-[#6A5ACD] rounded px-2 py-1 text-sm text-[#2A2455]"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={spec.isChatEnabled ?? true} onChange={(e) => handleChange(i, "isChatEnabled", e.target.checked)} className="w-4 h-4 cursor-pointer text-[#6A5ACD] accent-[#6A5ACD]" />
                    <span className="block text-xs font-bold text-[#B8A7FF]">Chat</span>
                  </label>
                </div>
                {spec.isChatEnabled !== false && (
                  <input
                    type="number"
                    min="0"
                    value={spec.chatPrice}
                    onChange={(e) => handleChange(i, "chatPrice", e.target.value)}
                    placeholder="EGP"
                    className="w-full bg-[#FBFAFF] border border-[#6A5ACD] rounded px-2 py-1 text-sm text-[#2A2455]"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={spec.isVideoEnabled ?? true} onChange={(e) => handleChange(i, "isVideoEnabled", e.target.checked)} className="w-4 h-4 cursor-pointer text-[#6A5ACD] accent-[#6A5ACD]" />
                    <span className="block text-xs font-bold text-[#B8A7FF]">Video</span>
                  </label>
                </div>
                {spec.isVideoEnabled !== false && (
                  <input
                    type="number"
                    min="0"
                    value={spec.videoPrice}
                    onChange={(e) => handleChange(i, "videoPrice", e.target.value)}
                    placeholder="EGP"
                    className="w-full bg-[#FBFAFF] border border-[#6A5ACD] rounded px-2 py-1 text-sm text-[#2A2455]"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={spec.isCallEnabled ?? true} onChange={(e) => handleChange(i, "isCallEnabled", e.target.checked)} className="w-4 h-4 cursor-pointer text-[#6A5ACD] accent-[#6A5ACD]" />
                    <span className="block text-xs font-bold text-[#B8A7FF]">Call</span>
                  </label>
                </div>
                {spec.isCallEnabled !== false && (
                  <input
                    type="number"
                    min="0"
                    value={spec.callPrice}
                    onChange={(e) => handleChange(i, "callPrice", e.target.value)}
                    placeholder="EGP"
                    className="w-full bg-[#FBFAFF] border border-[#6A5ACD] rounded px-2 py-1 text-sm text-[#2A2455]"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleAdd}
        className="mt-3 flex items-center gap-1 text-sm text-[#6A5ACD] font-bold hover:text-[#2A2455] cursor-pointer"
      >
        <FiPlus /> Add Specialty
      </button>
    </div>
  );
};
