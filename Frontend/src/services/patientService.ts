import api from './api';
import type patientExtraData from '../types/extraDataPatient';

export default class PatientService
{
    static async updatePatientData(data: patientExtraData): Promise<boolean> {
        try {
            await api.patch(
                'patient/change-patient-data',
                data,
                { withCredentials: true }
            );
            
            return true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 404) {
                    throw new Error("User not found!");
                } else if (error.response.status === 400) {
                    throw new Error("Invalid data provided!");
                }
            }
            
            console.error('An unexpected error occurred:', error);
            throw new Error("An unexpected error occurred.");
        }
    }
}