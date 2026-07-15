import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type patientExtraData from "../../types/extraDataPatient";
import { useAuth } from "../../context/AuthContext";
import PatientService from "../../services/patientService";
import { AxiosError } from "axios";
import ErrorBanner from "../../components/Auth/ErrorBanner";
import PatientProfileFormFields from "../../components/Profile/PatientProfileFormFields";
export default function ContinueData() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form States
  const [formData, setFormData] = useState<patientExtraData>({
    id: user?.id,
    address: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    emergencyPhone: "",
  });

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  const [hasAccess] = useState(location.state?.fromSignIn);

  useEffect(() => {
    if (location.state?.fromSignIn) {
      const newState = { ...location.state };
      delete newState.fromSignIn;
      navigate(location.pathname, { replace: true, state: newState });
    }
  }, [location.pathname, location.state, navigate]);

  if (!hasAccess) {
    return <Navigate to="/patient-profile" replace />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Address - completely optional, no format constraints
    // Age - only validate if not empty
    if (
      formData.age &&
      (isNaN(Number(formData.age)) ||
        Number(formData.age) < 1 ||
        Number(formData.age) > 120)
    ) {
      newErrors.age = "Invalid age.";
    }

    // Weight - only validate if not empty
    if (
      formData.weight &&
      (isNaN(Number(formData.weight)) ||
        Number(formData.weight) <= 0 ||
        Number(formData.weight) > 300)
    ) {
      newErrors.weight = "Invalid.";
    }

    // Height - only validate if not empty
    if (
      formData.height &&
      (isNaN(Number(formData.height)) ||
        Number(formData.height) <= 0 ||
        Number(formData.height) > 300)
    ) {
      newErrors.height = "Invalid.";
    }

    // Emergency Phone - only validate format if not empty
    if (
      formData.emergencyPhone &&
      !/^\+?[\d\s-]{8,}$/.test(formData.emergencyPhone)
    ) {
      newErrors.emergencyPhone =
        "Invalid format. (Format: +201012345678 or 01012345678)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSaveAndContinue = async () => {
    setGlobalError("");
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      await PatientService.updatePatientData(formData);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        const errorData = error.response.data;
        if (Array.isArray(errorData) && errorData.length > 0) {
          let hasMappedError = false;
          const backendErrors: Record<string, string> = {};
          
          errorData.forEach((errItem: any) => {
            const desc = errItem.description || "";
            const descLower = desc.toLowerCase();
            if (descLower.includes("address")) { backendErrors.address = desc; hasMappedError = true; }
            else if (descLower.includes("age")) { backendErrors.age = desc; hasMappedError = true; }
            else if (descLower.includes("gender")) { backendErrors.gender = desc; hasMappedError = true; }
            else if (descLower.includes("weight")) { backendErrors.weight = desc; hasMappedError = true; }
            else if (descLower.includes("height")) { backendErrors.height = desc; hasMappedError = true; }
            else if (descLower.includes("phone") || descLower.includes("emergency")) { backendErrors.emergencyPhone = desc; hasMappedError = true; }
          });
          
          if (hasMappedError) {
             setErrors(prev => ({ ...prev, ...backendErrors }));
          } else {
             setGlobalError(errorData[0].description);
          }
        } else if (typeof errorData === "string") {
          setGlobalError(errorData);
        }
      } else if (error instanceof AxiosError) {
        setGlobalError(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-bright text-on-surface text-[15px] lg:text-[16px] leading-[24px] font-normal antialiased h-screen max-h-screen overflow-hidden flex flex-col selection:bg-primary selection:text-surface-container">
      <main className="flex-grow flex w-full h-full relative overflow-hidden">
        {/* Full-Screen Background Image Layer */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <img
            alt="Tabibi Medical Group"
            className="w-full h-full object-cover object-left"
            src="user-login.jpg"
          />
        </div>

        {/* Ambient Gradient Masks */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-0"></div>
          <div className="absolute inset-y-0 right-0 w-[60%] bg-gradient-to-t to-transparent backdrop-blur-sm"></div>
        </div>

        <div className="relative w-full h-full flex flex-col lg:flex-row z-20 max-lg:backdrop-blur-sm overflow-hidden">
          {/* Left Side Branding Block */}
          <div className="hidden lg:flex flex-col justify-end w-[35%] p-8 lg:p-12 pb-16 lg:pb-22">
            <div className="max-w-md">
              <h2 className="text-[32px] lg:text-[38px] leading-[38px] lg:leading-[46px] tracking-[-0.01em] font-bold mb-3 text-white drop-shadow-md">
                Care that revolves around you.
              </h2>
              <p className="text-[15px] lg:text-[17px] leading-[23px] lg:leading-[27px] font-normal text-white/90 drop-shadow-sm">
                Join Tabibi today and experience modern healthcare management
                tailored to your needs.
              </p>
            </div>
          </div>

          {/* Right Side: Form Container Center Alignment */}
          <div className="w-full lg:w-[65%] h-full flex items-center justify-center p-4 lg:p-8 ml-auto overflow-hidden">
            {/* Removed overflow-hidden from card container to prevent border styling clips */}
            <div className="w-full max-w-2xl flex flex-col gap-4 lg:gap-5 bg-white/95 backdrop-blur-md p-6 lg:p-10 rounded-3xl shadow-2xl border border-white/20 max-h-[96vh] overflow-y-auto">
              {/* Header Module with Personalized Hello Greeting */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-1.5">
                <h1 className="text-[24px] lg:text-[28px] leading-[30px] lg:leading-[36px] font-bold text-on-surface">
                  Hello, {user?.fullName}!
                </h1>
                <p className="text-[14px] leading-[20px] text-on-surface-variant">
                  Please provide a few more details to help us personalize your
                  medical journey. These fields are optional but recommended.
                </p>
              </div>

              {/* Secure HTML Form Area */}
              <form className="space-y-5" noValidate>
                {globalError && <ErrorBanner message={globalError} />}
                <PatientProfileFormFields
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  isLoading={isLoading}
                />

                {/* Main Viewport Operations Layer */}
                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    className={`flex-1 h-11.5 flex items-center justify-center bg-primary text-surface-container hover:bg-primary-dark hover:text-white rounded-full text-[14px] font-semibold transition-all shadow-md active:scale-[0.98] ${
                      isLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => handleSaveAndContinue()}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Save and Continue"}
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="cursor-pointer flex-1 h-11.5 flex items-center justify-center bg-white/90 border border-surface-variant focus:ring-1 focus:ring-primary-dark text-primary-dark hover:bg-surface-container rounded-full text-[14px] font-semibold transition-all active:scale-[0.98]"
                    type="button"
                    disabled={isLoading}
                  >
                    Skip Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
