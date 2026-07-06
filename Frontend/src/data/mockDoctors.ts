import type { MockDoctor } from "../types/doctor";
import type { DoctorListItem } from "../types/public";

export const MOCK_DOCTORS_RAW: MockDoctor[] = [
  {
    id: 1,
    fullName: "Ahmed Hassan",
    specialty: "Cardiology",
    clinicLocation: "Nasr City, Cairo",
    yearsOfExperience: 10,
    isVerified: true,
    averageRating: 4.8,
    availability: [
      { day: "Sunday",    slots: ["10:00", "11:00", "12:00"] },
      { day: "Monday",    slots: ["14:00", "15:00", "16:00"] },
      { day: "Wednesday", slots: ["09:00", "10:00", "11:00"] },
    ],
  },
  {
    id: 2,
    fullName: "Sara Mohamed",
    specialty: "Dermatology",
    clinicLocation: "Mohandessin, Giza",
    yearsOfExperience: 8,
    isVerified: true,
    averageRating: 4.6,
    availability: [
      { day: "Monday",   slots: ["10:00", "11:00"] },
      { day: "Tuesday",  slots: ["14:00", "15:00", "16:00"] },
      { day: "Thursday", slots: ["09:00", "10:00"] },
    ],
  },
  {
    id: 3,
    fullName: "Omar Hassan",
    specialty: "Pediatrics",
    clinicLocation: "Smouha, Alexandria",
    yearsOfExperience: 15,
    isVerified: true,
    averageRating: 4.9,
    availability: [
      { day: "Sunday",   slots: ["09:00", "10:00", "11:00", "12:00"] },
      { day: "Tuesday",  slots: ["15:00", "16:00"] },
      { day: "Saturday", slots: ["10:00", "11:00"] },
    ],
  },
  {
    id: 4,
    fullName: "Nour Ibrahim",
    specialty: "Orthopedics",
    clinicLocation: "Maadi, Cairo",
    yearsOfExperience: 12,
    isVerified: false,
    averageRating: 4.5,
    availability: [
      { day: "Wednesday", slots: ["13:00", "14:00", "15:00"] },
      { day: "Friday",    slots: ["10:00", "11:00", "12:00"] },
    ],
  },
  {
    id: 5,
    fullName: "Yasmine Farouk",
    specialty: "Neurology",
    clinicLocation: "Mansoura, Dakahlia",
    yearsOfExperience: 9,
    isVerified: true,
    averageRating: 4.7,
    availability: [
      { day: "Sunday",   slots: ["14:00", "15:00"] },
      { day: "Monday",   slots: ["10:00", "11:00", "12:00"] },
      { day: "Thursday", slots: ["16:00", "17:00"] },
    ],
  },
  {
    id: 6,
    fullName: "Karim Adel",
    specialty: "Dermatology",
    clinicLocation: "6th of October, Giza",
    yearsOfExperience: 6,
    isVerified: true,
    averageRating: 4.4,
    availability: [
      { day: "Tuesday",  slots: ["11:00", "12:00"] },
      { day: "Saturday", slots: ["14:00", "15:00", "16:00"] },
    ],
  },
  {
    id: 7,
    fullName: "Hana Sayed",
    specialty: "Ophthalmology",
    clinicLocation: "Heliopolis, Cairo",
    yearsOfExperience: 11,
    isVerified: true,
    averageRating: 4.9,
    availability: [
      { day: "Sunday",    slots: ["10:00", "11:00", "12:00"] },
      { day: "Wednesday", slots: ["14:00", "15:00"] },
      { day: "Friday",    slots: ["09:00", "10:00", "11:00"] },
    ],
  },
  {
    id: 8,
    fullName: "Mostafa Ali",
    specialty: "General Practice",
    clinicLocation: "Downtown, Cairo",
    yearsOfExperience: 5,
    isVerified: false,
    averageRating: 4.3,
    availability: [
      { day: "Monday",    slots: ["09:00", "10:00", "11:00", "12:00"] },
      { day: "Tuesday",   slots: ["14:00", "15:00", "16:00"] },
      { day: "Thursday",  slots: ["09:00", "10:00"] },
      { day: "Saturday",  slots: ["10:00", "11:00", "12:00"] },
    ],
  },
];

/** Per-doctor pricing table (EGP). Maps doctor id → consultation prices. */
const DOCTOR_PRICING: Record<
  number,
  { clinicPrice: number; videoPrice: number; callPrice: number; chatPrice: number }
> = {
  1: { clinicPrice: 350, videoPrice: 250, callPrice: 200, chatPrice: 150 },
  2: { clinicPrice: 300, videoPrice: 220, callPrice: 180, chatPrice: 120 },
  3: { clinicPrice: 400, videoPrice: 300, callPrice: 250, chatPrice: 180 },
  4: { clinicPrice: 320, videoPrice: 230, callPrice: 190, chatPrice: 130 },
  5: { clinicPrice: 380, videoPrice: 280, callPrice: 230, chatPrice: 160 },
  6: { clinicPrice: 280, videoPrice: 200, callPrice: 160, chatPrice: 110 },
  7: { clinicPrice: 420, videoPrice: 310, callPrice: 260, chatPrice: 190 },
  8: { clinicPrice: 200, videoPrice: 150, callPrice: 120, chatPrice:  90 },
};

/** Short bios for each doctor. */
const DOCTOR_BIOS: Record<number, string> = {
  1: "Specialist in interventional cardiology and heart failure management with a focus on minimally invasive procedures.",
  2: "Expert in medical and aesthetic dermatology, offering treatments for acne, eczema, and skin rejuvenation.",
  3: "Dedicated pediatrician committed to child health from newborn care through adolescence.",
  4: "Orthopedic surgeon specializing in sports injuries, joint replacement, and spine care.",
  5: "Neurologist focused on headache disorders, epilepsy, and neurodegenerative diseases.",
  6: "Dermatologist with expertise in laser therapy, hair loss treatment, and cosmetic procedures.",
  7: "Ophthalmologist skilled in cataract surgery, retinal disorders, and refractive eye care.",
  8: "General practitioner providing comprehensive primary care, preventive medicine, and chronic disease management.",
};

export const MOCK_SPECIALTY_NAMES: string[] = [
  ...new Set(MOCK_DOCTORS_RAW.map((d) => d.specialty)),
].sort();

/** Convert mock record → list item shape used by UI (ready for API swap) */
export function mockDoctorToListItem(mock: MockDoctor): DoctorListItem {
  const pricing = DOCTOR_PRICING[mock.id] ?? {
    clinicPrice: 0, videoPrice: 0, callPrice: 0, chatPrice: 0,
  };
  return {
    doctorId: mock.id,
    fullName: mock.fullName,
    clinicLocation: mock.clinicLocation,
    yearsOfExperience: mock.yearsOfExperience,
    isVerified: mock.isVerified,
    availability: mock.availability,
    averageRating: mock.averageRating ?? 4.5,
    isAvailableNow: mock.availability.some((d) => d.slots.length > 0),
    bio: DOCTOR_BIOS[mock.id],
    specialties: [
      {
        specialtyId: mock.id,
        name: mock.specialty,
        clinicPrice: pricing.clinicPrice,
        chatPrice:   pricing.chatPrice,
        videoPrice:  pricing.videoPrice,
        callPrice:   pricing.callPrice,
      },
    ],
  };
}

export const MOCK_DOCTORS: DoctorListItem[] =
  MOCK_DOCTORS_RAW.map(mockDoctorToListItem);

export function filterMockDoctors(
  filter: { name?: string; specialty?: string },
): DoctorListItem[] {
  let result = [...MOCK_DOCTORS];

  if (filter.name?.trim()) {
    const term = filter.name.trim().toLowerCase();
    result = result.filter((d) =>
      d.fullName.toLowerCase().includes(term),
    );
  }

  if (filter.specialty) {
    result = result.filter((d) =>
      d.specialties.some((s) => s.name === filter.specialty),
    );
  }

  return result;
}
