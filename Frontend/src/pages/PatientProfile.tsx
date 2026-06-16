import React, { useState } from 'react';
import { 

  FiCamera,  
  FiCalendar, 
  FiUser, 
  FiPhone,
  FiMapPin
} from 'react-icons/fi';
import { FaWeight, FaRulerVertical } from 'react-icons/fa';
import type { ProfileData } from '../types/profilePageProps';
import { EditableDetailItem } from '../components/Profile/EditableDetail';
import { EditableHeaderField } from '../components/Profile/EditableHeader';
import { useAuth } from '../context/AuthContext';



const ProfilePage: React.FC = () => {

  const [editingField, setEditingField] = useState<keyof ProfileData | null>(null);
  const {user} = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    fullName: user?.fullName,
    email: user?.email,
    phone: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    emergencyContact: '',
    address: '',
    imageUrl: '' 
  });


  const handleSave = (field: keyof ProfileData, value: string | undefined) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const handleImageClick = () => {
    alert("Image upload trigger goes here.");
  };

  return (
    <div className="min-h-screen bg-[#FBFAFF] pt-10 pb-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start font-sans text-[#2A2455]">
      <div className="w-full h-fit flex flex-col bg-white sm:rounded-2xl shadow-xl sm:border border-[#E6E1FF]">
        
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-[#E6E1FF] bg-white flex flex-col items-center sm:flex-row sm:items-start gap-6 sm:rounded-t-2xl">
          
          {/* Avatar Container */}
          <div className="relative cursor-pointer flex-shrink-0" onClick={handleImageClick}>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#E6E1FF] bg-[#FBFAFF] flex items-center justify-center">
              {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-[#B8A7FF] text-5xl" />
              )}
            </div>
            {/* Camera icon overlay */}
            <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 bg-[#6A5ACD] p-2 rounded-full border-2 border-white shadow-sm hover:bg-[#2A2455] transition-colors">
              <FiCamera className="text-white text-lg" />
            </div>
          </div>

          {/* Name & Handle */}
          <div className="flex-1 text-center sm:text-left flex flex-col justify-center items-center sm:items-start w-full sm:mt-2">
            <EditableHeaderField 
              value={profile.fullName} 
              isEditing={editingField === 'fullName'}
              onEdit={() => setEditingField('fullName')}
              onSave={(val) => handleSave('fullName', val)}
              onCancel={() => setEditingField(null)}
              textClass="text-3xl sm:text-4xl font-bold text-[#2A2455] leading-tight"
            />
            <div className="mt-2">
               <EditableHeaderField 
                value={profile.email} 
                isEditing={editingField === 'email'}
                onEdit={() => setEditingField('email')}
                onSave={(val) => handleSave('email', val)}
                onCancel={() => setEditingField(null)}
                textClass="text-xl sm:text-2xl font-medium text-[#2A2455]"
                prefix={<span className="text-red-500 font-bold">s</span>}
              />
            </div>
          </div>
        </div>

        {/* Details Grid Section - Natural flow, no forced overflow */}
        <div className="p-4 sm:p-8 bg-[#FBFAFF]/50 sm:rounded-b-2xl">
          <h2 className="text-xl font-bold mb-6 text-[#6A5ACD] px-2 sm:px-0">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <EditableDetailItem 
              icon={<FiPhone />} label="Phone" value={profile.phone}
              isEditing={editingField === 'email'}
              onEdit={() => setEditingField('email')}
              onSave={(val) => handleSave('email', val)}
              onCancel={() => setEditingField(null)}
              type="email"
            />
            <EditableDetailItem 
              icon={<FiCalendar />} label="Age" value={profile.age}
              isEditing={editingField === 'age'}
              onEdit={() => setEditingField('age')}
              onSave={(val) => handleSave('age', val)}
              onCancel={() => setEditingField(null)}
              type="number"
            />
            <EditableDetailItem 
              icon={<FiUser />} label="Gender" value={profile.gender}
              isEditing={editingField === 'gender'}
              onEdit={() => setEditingField('gender')}
              onSave={(val) => handleSave('gender', val)}
              onCancel={() => setEditingField(null)}
            />
            <EditableDetailItem 
              icon={<FaWeight />} label="Weight" value={profile.weight}
              isEditing={editingField === 'weight'}
              onEdit={() => setEditingField('weight')}
              onSave={(val) => handleSave('weight', val)}
              onCancel={() => setEditingField(null)}
            />
            <EditableDetailItem 
              icon={<FaRulerVertical />} label="Height" value={profile.height}
              isEditing={editingField === 'height'}
              onEdit={() => setEditingField('height')}
              onSave={(val) => handleSave('height', val)}
              onCancel={() => setEditingField(null)}
            />
            <EditableDetailItem 
              icon={<FiPhone />} label="Emergency Contact" value={profile.emergencyContact}
              isEditing={editingField === 'emergencyContact'}
              onEdit={() => setEditingField('emergencyContact')}
              onSave={(val) => handleSave('emergencyContact', val)}
              onCancel={() => setEditingField(null)}
              type="tel"
            />
            <div className="md:col-span-2">
              <EditableDetailItem 
                icon={<FiMapPin />} label="Address" value={profile.address}
                isEditing={editingField === 'address'}
                onEdit={() => setEditingField('address')}
                onSave={(val) => handleSave('address', val)}
                onCancel={() => setEditingField(null)}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;