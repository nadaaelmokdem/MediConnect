import React, { useEffect, useState } from "react";
import {
  FiCamera,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { FaWeight, FaRulerVertical } from "react-icons/fa";
import type { ProfileData } from "../types/profilePageProps";
import { EditableDetailItem } from "../components/Profile/EditableDetail";
import PatientService from "../services/patientService";

const ProfilePage: React.FC = () => {
  const [editingField, setEditingField] = useState<keyof ProfileData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    emergencyContact: "",
    address: "",
    imageUrl: "",
  });

  useEffect(() => {
    const func = async () => {
      try {
        setIsLoading(true);
        const profileData = await PatientService.getProfile();
        setProfile((prev) => ({
          ...prev,
          fullName: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          age: profileData.age,
          gender: profileData.gender,
          weight: profileData.weight,
          height: profileData.height,
          emergencyContact: profileData.emergency,
          address: profileData.address,
        }));
      } catch (error) {
        console.log("Error: " + error);
      } finally {
        setIsLoading(false);
      }
    };
    func();
  }, []);

  const handleSave = async (
    field: keyof ProfileData,
    value: string | undefined,
  ) => {
    try {
      if (value !== undefined) {
        await PatientService.updateProfileField(field as string, value);
        setProfile((prev) => ({ ...prev, [field]: value }));
      }
    } catch (error) {
      console.error("Failed to update profile field:", error);
    } finally {
      setEditingField(null);
    }
  };

  const handleImageClick = () => {
    alert("Image upload trigger goes here.");
  };

  if (isLoading) {
    return (
      <div className="bg-[#FBFAFF] pt-10 px-4 sm:px-6 lg:px-15 flex justify-center items-start font-sans text-[#2A2455]">
        <div className="w-full h-fit flex flex-col bg-white sm:rounded-2xl shadow-xl sm:border border-[#E6E1FF]">
          {/* Header Skeleton */}
          <div className="p-4 sm:p-6 border-b border-[#E6E1FF] bg-white flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 sm:rounded-t-2xl">
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E6E1FF] animate-pulse"></div>
            {/* Text Skeleton */}
            <div className="flex-1 w-full space-y-2">
              <div className="h-8 bg-[#E6E1FF] rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-[#E6E1FF] rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-[#E6E1FF] rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
          {/* Grid Skeleton */}
          <div className="p-4 sm:p-8 bg-[#FBFAFF]/50 sm:rounded-b-2xl">
            <div className="h-6 bg-[#E6E1FF] rounded w-1/4 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-[#E6E1FF] rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFAFF] pt-10 px-4 sm:px-6 lg:px-15 flex justify-center items-start font-sans text-[#2A2455]">
      <div className="w-full h-fit flex flex-col bg-white sm:rounded-2xl shadow-xl sm:border border-[#E6E1FF]">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-[#E6E1FF] bg-white flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6 sm:rounded-t-2xl">
          {/* Avatar Container */}
          <div
            className="relative cursor-pointer flex-shrink-0"
            onClick={handleImageClick}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#E6E1FF] bg-[#FBFAFF] flex items-center justify-center">
              {profile.imageUrl ? (
                <img
                  src={profile.imageUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-[#B8A7FF] text-4xl" />
              )}
            </div>
            {/* Camera icon overlay */}
            <div className="absolute bottom-0 right-0 bg-[#6A5ACD] p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-[#2A2455] transition-colors">
              <FiCamera className="text-white text-sm" />
            </div>
          </div>

          {/* Name & Handle */}
          <div className="flex-1 text-center sm:text-left flex flex-col justify-center w-full">
            <div className="flex items-center gap-3 justify-center sm:justify-start w-full">
              <h1
                className={
                  "text-2xl sm:text-3xl font-bold text-[#2A2455] truncate max-w-full"
                }
              >
                {profile.fullName}
              </h1>
            </div>
            <div className="mt-0.5">
              <div className="flex items-center gap-3 justify-center sm:justify-start w-full">
                <h1
                  className={
                    "text-lg sm:text-xl font-medium text-[#2A2455] truncate max-w-full"
                  }
                >
                  {profile.email}
                </h1>
              </div>
            </div>
            <div className="mt-0.5">
              <div className="flex items-center gap-3 justify-center sm:justify-start w-full">
                <h1
                  className={
                    "text-lg sm:text-xl font-medium text-[#2A2455] truncate max-w-full"
                  }
                >
                  {profile.phone}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid Section */}
        <div className="p-4 sm:p-8 bg-[#FBFAFF]/50 sm:rounded-b-2xl">
          <h2 className="text-xl font-bold mb-4 text-[#6A5ACD] px-2 sm:px-0">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <EditableDetailItem
              icon={<FiCalendar />}
              label="Age"
              value={profile.age}
              isEditing={editingField === "age"}
              onEdit={() => setEditingField("age")}
              onSave={(val) => handleSave("age", val)}
              onCancel={() => setEditingField(null)}
              type="number"
              fieldName="age"
            />
            <EditableDetailItem
              icon={<FiUser />}
              label="Gender"
              value={profile.gender}
              isEditing={editingField === "gender"}
              onEdit={() => setEditingField("gender")}
              onSave={(val) => handleSave("gender", val)}
              onCancel={() => setEditingField(null)}
              options={["Male", "Female"]}
              fieldName="gender"
            />
            <EditableDetailItem
              icon={<FaWeight />}
              label="Weight (kg)"
              value={profile.weight}
              isEditing={editingField === "weight"}
              onEdit={() => setEditingField("weight")}
              onSave={(val) => handleSave("weight", val)}
              onCancel={() => setEditingField(null)}
              type="number"
              fieldName="weight"
            />
            <EditableDetailItem
              icon={<FaRulerVertical />}
              label="Height (cm)"
              value={profile.height}
              isEditing={editingField === "height"}
              onEdit={() => setEditingField("height")}
              onSave={(val) => handleSave("height", val)}
              onCancel={() => setEditingField(null)}
              type="number"
              fieldName="height"
            />
            <EditableDetailItem
              icon={<FiPhone />}
              label="Emergency Contact"
              value={profile.emergencyContact}
              isEditing={editingField === "emergencyContact"}
              onEdit={() => setEditingField("emergencyContact")}
              onSave={(val) => handleSave("emergencyContact", val)}
              onCancel={() => setEditingField(null)}
              type="tel"
              fieldName="emergencyContact"
            />

            <EditableDetailItem
              icon={<FiMapPin />}
              label="Address"
              value={profile.address}
              isEditing={editingField === "address"}
              onEdit={() => setEditingField("address")}
              onSave={(val) => handleSave("address", val)}
              onCancel={() => setEditingField(null)}
              fieldName="address"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
