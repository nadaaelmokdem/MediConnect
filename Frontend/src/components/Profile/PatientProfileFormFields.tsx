import { MdLocationOn, MdContacts } from "react-icons/md";
import type patientExtraData from "../../types/extraDataPatient";

interface Props {
  formData: patientExtraData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
  isLoading: boolean;
}

export default function PatientProfileFormFields({ formData, handleInputChange, errors, isLoading }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Address Module */}
      <div className="md:col-span-2">
        <label className="block text-[13px] lg:text-[14px] font-semibold text-on-surface mb-1.5">
          Home Address
        </label>
        <div className="relative">
          <MdLocationOn
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${errors.address ? "text-red-400" : "text-outline-variant"}`}
          />
          <input
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            className={`w-full h-11 pl-11 pr-4 bg-white border rounded-lg text-[14px] lg:text-[15px] outline-none transition-all ${
              errors.address
                ? "border-red-400 focus:border-red-500"
                : "border-surface-variant focus:ring-1 focus:ring-primary-dark focus:border-primary-light"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            placeholder="123 Wellness Ave, Health City"
            type="text"
            disabled={isLoading}
          />
        </div>
        {errors.address && (
          <p className="text-red-500 text-[12px] mt-1 font-medium">{errors.address}</p>
        )}
      </div>

      {/* Age Input */}
      <div>
        <label className="block text-[13px] lg:text-[14px] font-semibold text-on-surface mb-1.5">
          Age
        </label>
        <input
          name="age"
          value={formData.age || ""}
          onChange={handleInputChange}
          className={`w-full h-11 px-4 bg-white border rounded-lg text-[14px] lg:text-[15px] outline-none transition-all ${
            errors.age
              ? "border-red-400 focus:border-red-500"
              : "border-surface-variant focus:ring-1 focus:ring-primary-dark"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          placeholder="e.g. 28"
          type="text"
          disabled={isLoading}
        />
        {errors.age && (
          <p className="text-red-500 text-[12px] mt-1 font-medium">{errors.age}</p>
        )}
      </div>

      {/* Gender Selector */}
      <div>
        <label className="block text-[13px] lg:text-[14px] font-semibold text-on-surface mb-1.5">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleInputChange}
          className={`w-full h-11 px-4 bg-white border rounded-lg text-[14px] lg:text-[15px] outline-none transition-all appearance-none ${
            errors.gender
              ? "border-red-400 focus:border-red-500"
              : "border-surface-variant focus:ring-1 focus:ring-primary-dark focus:border-primary-light"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-[12px] mt-1 font-medium">{errors.gender}</p>
        )}
      </div>

      {/* Weight Element */}
      <div>
        <label className="block text-[13px] lg:text-[14px] font-semibold text-on-surface mb-1.5">
          Weight
        </label>
        <div className="relative flex items-center">
          <input
            name="weight"
            value={formData.weight || ""}
            onChange={handleInputChange}
            className={`w-full h-11 px-4 bg-white border rounded-lg text-[14px] lg:text-[15px] outline-none transition-all ${
              errors.weight
                ? "border-red-400 focus:border-red-500"
                : "border-surface-variant focus:ring-1 focus:ring-primary-dark focus:border-primary-light"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            placeholder="70"
            type="text"
            disabled={isLoading}
          />
          <span className="absolute right-4 text-outline-variant text-[12px] font-bold">kg</span>
        </div>
        {errors.weight && (
          <p className="text-red-500 text-[12px] mt-1 font-medium">{errors.weight}</p>
        )}
      </div>

      {/* Height Element */}
      <div>
        <label className="block text-[13px] lg:text-[14px] font-semibold text-on-surface mb-1.5">
          Height
        </label>
        <div className="relative flex items-center">
          <input
            name="height"
            value={formData.height || ""}
            onChange={handleInputChange}
            className={`w-full h-11 px-4 bg-white border rounded-lg text-[14px] lg:text-[15px] outline-none transition-all ${
              errors.height
                ? "border-red-400 focus:border-red-500"
                : "border-surface-variant focus:ring-1 focus:ring-primary-dark focus:border-primary-light"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            placeholder="175"
            type="text"
            disabled={isLoading}
          />
          <span className="absolute right-4 text-outline-variant text-[12px] font-bold">cm</span>
        </div>
        {errors.height && (
          <p className="text-red-500 text-[12px] mt-1 font-medium">{errors.height}</p>
        )}
      </div>

      {/* Compact Emergency Contact Sub-Card */}
      <div
        className={`md:col-span-2 p-4 bg-surface-container/60 rounded-xl border transition-colors ${
          errors.emergencyName || errors.emergencyPhone
            ? "border-red-200 bg-red-50/20"
            : "border-surface-variant focus:ring-1 focus:ring-primary-dark"
        }`}
      >
        <h3 className="text-[13px] lg:text-[14px] font-semibold text-on-surface mb-3 flex items-center gap-2">
          <MdContacts
            className={`text-xl ${errors.emergencyName || errors.emergencyPhone ? "text-red-500" : "text-primary-dark"}`}
          />
          Emergency Contact Info
        </h3>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            <input
              name="emergencyPhone"
              value={formData.emergencyPhone || ""}
              onChange={handleInputChange}
              className={`w-full h-10 px-3.5 bg-white border rounded-lg text-[13px] lg:text-[14px] outline-none transition-all ${
                errors.emergencyPhone
                  ? "border-red-300 focus:border-red-500"
                  : "border-surface-variant focus:ring-1 focus:ring-primary-dark focus:border-primary-light"
              }`}
              placeholder="+201012345678"
              type="tel"
              disabled={isLoading}
            />

            {errors.emergencyPhone ? (
              <p className="text-red-500 text-[11px] mt-1 font-medium text-center">
                {errors.emergencyPhone}
              </p>
            ) : (
              <p className="text-outline-variant text-[11px] mt-1 font-normal leading-relaxed text-center">
                This number is used in case of emergencies. Please provide a trusted contact, such as a relative or guardian, Do not put your number or a secondary number.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
