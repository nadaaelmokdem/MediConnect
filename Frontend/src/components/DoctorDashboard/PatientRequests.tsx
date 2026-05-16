import { LuClipboardList } from 'react-icons/lu';
import type { RequestItem } from '../../types/DoctorDashboard';

interface PatientRequestsProps {
  requests: RequestItem[];
  onAccept: (req: RequestItem) => void;
  onReschedule: (id: number) => void;
}

export default function PatientRequests({ 
  requests, 
  onAccept, 
  onReschedule 
}: PatientRequestsProps) {
  return (
    <section className="bg-white rounded-xl shadow-ambient-card border border-surface-variant flex-1 flex flex-col hover:shadow-ambient-float transition-shadow duration-300">
      <div className="p-md border-b border-surface-variant flex justify-between items-center">
        <h3 className="font-label-md text-label-md text-custom-text flex items-center gap-xs">
          <LuClipboardList className="text-[18px] text-custom-secondary" />
          Patient Requests
        </h3>
        {requests.length > 0 && (
          <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-2 py-0.5 rounded-full animate-pulse">
            {requests.length} New
          </span>
        )}
      </div>
      <div className="p-md space-y-md">
        {requests.length === 0 ? (
          <p className="text-center text-sm text-on-surface-variant py-4">No new requests</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-md border border-surface-variant rounded-lg bg-custom-light-bg/30 hover:bg-custom-light-bg/50 transition-colors">
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <p className="font-label-md text-label-md text-custom-text">{request.name}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{request.concern}</p>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{request.timeDisplay}</p>
              </div>
              <div className="flex gap-sm mt-sm">
                <button
                  onClick={() => onAccept(request)}
                  className="flex-1 bg-custom-primary text-white font-label-sm text-label-sm py-xs rounded-md shadow-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReschedule(request.id)}
                  className="flex-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm py-xs rounded-md hover:bg-surface-dim active:scale-95 transition-all"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-sm text-center border-t border-surface-variant mt-auto">
        <button className="text-custom-primary font-label-sm text-label-sm hover:underline transition-all">
          View All Requests
        </button>
      </div>
    </section>
  );
}