import { MdLocationOn } from "react-icons/md";
import type { DoctorProfileSectionProps } from "../../types/profile";

export default function DoctorClinicInformationSection({
  formData,
  handleInputChange,
  isLoading,
}: DoctorProfileSectionProps) {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-surface-variant space-y-5">
      <div className="border-b border-surface-variant pb-3">
        <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <MdLocationOn className="text-primary-dark" /> Clinic Information (Optional)
        </h2>
        <p className="text-sm text-outline">Details about your physical clinic. You can add it later.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] lg:text-[14px] font-semibold text-on-surface mb-1">
            Physical Clinic Address
          </label>
          <p className="text-[11px] text-outline mb-1.5">Your main practice location</p>
          <input
            name="clinicLocation"
            value={formData.clinicLocation}
            onChange={handleInputChange}
            className="w-full h-11 px-4 bg-white border border-surface-variant rounded-lg text-[14px] lg:text-[15px] outline-none transition-all focus:ring-1 focus:ring-primary-dark"
            placeholder="Building 4, Medical Square"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-[13px] lg:text-[14px] font-semibold text-on-surface mb-1">
            Clinic Desk Line
          </label>
          <p className="text-[11px] text-outline mb-1.5">Primary contact number</p>
          <input
            name="clinicPhoneNumber"
            value={formData.clinicPhoneNumber}
            onChange={handleInputChange}
            className="w-full h-11 px-4 bg-white border border-surface-variant rounded-lg text-[14px] lg:text-[15px] outline-none transition-all focus:ring-1 focus:ring-primary-dark"
            placeholder="+202XXXXXXXX"
            disabled={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
