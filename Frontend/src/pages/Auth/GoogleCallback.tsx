import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // "User" or "Doctor"
    const role = state === "Doctor" ? "Doctor" : "User";

    if (!code) {
      setError("No authentication code provided from Google");
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await googleLogin({ code, role });
        if (res.isNewUser) {
          // Redirect to register page with prefilled data
          const registerLink = role === "Doctor" ? "/doctor-register" : "/register";
          navigate(registerLink, {
            state: {
              isGoogleSignup: true,
              googleEmail: res.googleEmail,
              googleName: res.googleName,
              googleToken: res.googleToken,
            },
            replace: true
          });
        } else {
          // Logged in successfully, redirect to dashboards
          const target = role === "Doctor" ? "/doctor-appointments" : "/patient-appointments";
          navigate(target, { replace: true });
        }
      } catch (err: any) {
        console.error("Google authentication callback failed:", err);
        setError(err?.message || "Google authentication callback failed");
      }
    };

    exchangeCode();
  }, [searchParams, googleLogin, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container">
        <div className="bg-white border border-red-200 text-red-500 px-6 py-6 rounded-2xl shadow-xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-3">Authentication Error</h2>
          <p className="mb-5 text-on-surface/80">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-semibold"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container">
      <div className="flex flex-col items-center gap-4 bg-white px-8 py-10 rounded-2xl shadow-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-on-surface/85 font-semibold text-lg animate-pulse">
          Completing Google authentication...
        </p>
      </div>
    </div>
  );
}
