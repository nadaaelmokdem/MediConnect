interface AIChatAssessmentProps {
  topicDrift: boolean;
  urgencyLevel: string | null;
  classification: string | null;
  recommendedDepts: string[];
  handleFindDoctorClick: (dept?: string) => void;
  getUrgencyColor: (level: string) => string;
}

export default function AIChatAssessment({
  topicDrift,
  urgencyLevel,
  classification,
  recommendedDepts,
  handleFindDoctorClick,
  getUrgencyColor
}: AIChatAssessmentProps) {
  return (
    <>
      {topicDrift && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-xl text-sm text-center shadow-sm max-w-[80%] mx-auto font-medium">
          Please stick to describing your medical symptoms so we can assist you effectively.
        </div>
      )}

      {urgencyLevel && (
        <div className="flex flex-col items-center gap-3 mt-4 border-t border-surface-variant pt-6 max-w-[90%] mx-auto w-full">
          {classification && (
            <div className="flex items-center gap-2 mb-1 bg-white px-3 py-1.5 rounded-lg border border-surface-variant shadow-sm">
              <span className="text-sm font-bold text-on-surface">Classification:</span>
              <span className="text-primary text-[13px] font-semibold capitalize">
                {classification.replace(/_/g, ' ')}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-surface-variant shadow-sm">
            <span className="text-sm font-bold text-on-surface">Assessment Urgency:</span>
            <div className={`w-2.5 h-2.5 rounded-full ${getUrgencyColor(urgencyLevel)} shadow-sm`} />
            <span className="text-[13px] font-semibold text-on-surface-variant capitalize">{urgencyLevel}</span>
          </div>
          
          {urgencyLevel.toLowerCase() === "low" && (
            <p className="text-sm text-on-surface-variant font-medium mt-1">We suggest consulting a General Practice doctor for this matter.</p>
          )}

          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {recommendedDepts.length > 0 ? (
              recommendedDepts.map(dept => (
                <button 
                  key={dept} 
                  onClick={() => handleFindDoctorClick(dept)}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
                >
                  Find {dept} Doctor
                </button>
              ))
            ) : (
              <button 
                onClick={() => handleFindDoctorClick()}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
              >
                Find Doctors
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
