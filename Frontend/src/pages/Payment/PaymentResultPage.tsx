import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaRobot, FaComments } from "react-icons/fa";
import { useEffect } from "react";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const orderId = searchParams.get("orderId");
  const successStr = searchParams.get("success");
  const sessionId = searchParams.get("sessionId");
  const type = searchParams.get("type");
  const isSuccess = successStr === "true" || successStr === "True";

  const isAiRecharge = pathname.includes("ai-recharge");
  const isFollowUp = pathname.includes("followup");

  useEffect(() => {
    if (isSuccess) {
      if (isFollowUp && sessionId) {
        const timer = setTimeout(() => {
          navigate(`/chat/${sessionId}`, { replace: true });
        }, 1500); // Small delay to let the user see the success screen
        return () => clearTimeout(timer);
      } else if (!isAiRecharge && !isFollowUp && sessionId) {
        if (type === "video") {
          navigate(`/video-call/${sessionId}`, { replace: true });
        } else if (type === "chat") {
          navigate(`/chat/${sessionId}`, { replace: true });
        }
      }
    }
  }, [isSuccess, sessionId, type, navigate, isAiRecharge, isFollowUp]);

  // Determine contents based on page type
  let title = "";
  let description = "";
  let primaryButtonText = "";
  let primaryButtonIcon = null;
  let primaryButtonLink = "";
  let secondaryButtonText = "Go to Dashboard";
  let secondaryButtonLink = "/user-dashboard";

  if (isAiRecharge) {
    if (isSuccess) {
      title = "Recharge Successful!";
      description = "Your AI credits have been successfully recharged. You can now resume your AI medical assistant chat.";
      primaryButtonText = "Back to AI Chat";
      primaryButtonIcon = <FaRobot />;
      primaryButtonLink = "/ai-chat";
    } else {
      title = "Recharge Failed";
      description = "There was an issue processing your AI recharge payment. Please try again.";
      primaryButtonText = "Back to AI Chat";
      primaryButtonIcon = <FaRobot />;
      primaryButtonLink = "/ai-chat";
    }
  } else if (isFollowUp) {
    if (isSuccess) {
      title = "Payment Successful!";
      description = "Your follow-up session has been successfully initiated. Redirecting you back to your chat...";
      primaryButtonText = "Go to Chat";
      primaryButtonIcon = <FaComments />;
      primaryButtonLink = sessionId ? `/chat/${sessionId}` : "/chat";
    } else {
      title = "Payment Failed";
      description = "There was an issue processing your follow-up payment. Please try again.";
      primaryButtonText = "Back to Chat";
      primaryButtonIcon = <FaComments />;
      primaryButtonLink = sessionId ? `/chat/${sessionId}` : "/chat";
    }
  } else {
    // Default / Regular Appointment
    if (isSuccess) {
      title = "Payment Successful!";
      description = `Your appointment has been confirmed. Order ID: ${orderId || ""}`;
      primaryButtonText = "My Appointments";
      primaryButtonIcon = <FaCalendarAlt />;
      primaryButtonLink = "/appointments";
      secondaryButtonText = "Back to Doctors";
      secondaryButtonLink = "/doctors";
    } else {
      title = "Payment Failed";
      description = "There was an issue processing your payment. Please try booking again.";
      primaryButtonText = "Back to Doctors";
      primaryButtonIcon = null;
      primaryButtonLink = "/doctors";
      secondaryButtonText = "Go to Dashboard";
      secondaryButtonLink = "/user-dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-surface-container flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-surface-variant relative overflow-hidden">
        
        {/* Background blobs for premium feel */}
        <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-20 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl opacity-20 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-primary-dark mb-2">{title}</h2>
              <p className="text-text-muted mb-6">{description}</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
                <FaTimesCircle className="text-5xl text-red-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-primary-dark mb-2">{title}</h2>
              <p className="text-text-muted mb-6">{description}</p>
            </>
          )}

          <div className="flex flex-col w-full gap-3 mt-4">
            <Link 
              to={primaryButtonLink}
              className="w-full flex justify-center items-center gap-2 px-6 py-3.5 border border-transparent text-base font-bold rounded-xl text-white bg-primary hover:bg-primary-dark shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              {primaryButtonIcon} {primaryButtonText}
            </Link>
            <Link 
              to={secondaryButtonLink}
              className="w-full flex justify-center items-center px-6 py-3.5 border-2 border-surface-variant text-base font-bold rounded-xl text-on-surface-variant bg-white hover:bg-surface-container hover:text-primary-dark transition-colors cursor-pointer"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
