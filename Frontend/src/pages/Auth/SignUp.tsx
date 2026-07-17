import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdOutlineMail,
  MdArrowForward,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import BrandHeader from "../../components/Auth/BrandHeader";
import ErrorBanner from "../../components/Auth/ErrorBanner";
import Divider from "../../components/Auth/Divider";
import TermsFooter from "../../components/Auth/TermsFooter";
import GoogleButton from "../../components/Auth/GoogleButton";
import FormField from "../../components/common/FormField";
import PasswordField from "../../components/common/PasswordField";
import { AxiosError } from "axios";
import AuthLayout from "../../components/Auth/AuthLayout";

import type { SignUpProps, SignUpForm } from "../../types/props";

/* ─── Validation Constants ─── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s-]{8,15}$/;
const PASSWORD_REGEX = new RegExp(
  '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{} |<>\\\\/ ]).{8,}$',
);

/* ─── Validation Logic ─── */

function validateForm(form: SignUpForm, isGoogleSignup: boolean): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = "Name must be at least 2 characters long";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!PHONE_REGEX.test(form.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  }

  if (!isGoogleSignup) {
    if (!form.password) {
      errors.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(form.password)) {
      errors.password =
        "Must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special character";
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}

/* ─── Component ─── */

export default function SignUp({
  background,
  headerText,
  pText,
  signInLink,
  continueDataLink,
  requiredRole,
}: SignUpProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    isGoogleSignup?: boolean;
    googleEmail?: string;
    googleName?: string;
    googleToken?: string;
  } | null;

  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSignup, setIsGoogleSignup] = useState(locationState?.isGoogleSignup ?? false);
  const [googleToken, setGoogleToken] = useState<string | undefined>(locationState?.googleToken);

  const [form, setForm] = useState<SignUpForm>({
    fullName: locationState?.googleName ?? "",
    email: locationState?.googleEmail ?? "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userType: requiredRole === "Doctor" ? "doctor" : "user",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");

    const validationErrors = validateForm(form, isGoogleSignup);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await register(
        form.fullName,
        form.email,
        isGoogleSignup ? undefined : form.password,
        form.phoneNumber,
        requiredRole === "Doctor" ? "doctor" : "user",
        googleToken,
      );
      navigate(`/${continueDataLink}`, { state: { fromSignIn: true } });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data;
        if (Array.isArray(errorData) && errorData.length > 0) {
          let hasMappedError = false;
          const backendErrors: Record<string, string> = {};
          
          errorData.forEach((errItem: any) => {
            const desc = errItem.description || "";
            const descLower = desc.toLowerCase();
            
            if (descLower.includes("email") || descLower.includes("username")) {
              backendErrors.email = desc;
              hasMappedError = true;
            } else if (descLower.includes("password")) {
              backendErrors.password = desc;
              hasMappedError = true;
            } else if (descLower.includes("phone")) {
              backendErrors.phoneNumber = desc;
              hasMappedError = true;
            }
          });

          if (hasMappedError) {
            setErrors((prev) => ({ ...prev, ...backendErrors }));
          } else {
            setLocalError(errorData[0].description);
          }
        } else if (typeof errorData === "string") {
          setLocalError(errorData);
        }
      } else if (error instanceof AxiosError) {
        setLocalError(error.message);
      }
    }
  };

  const getInputBorderClass = (fieldName: string) =>
    errors[fieldName]
      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
      : "border-surface-variant focus:ring-primary-light focus:border-primary-light";

  return (
    <AuthLayout
      background={background}
      headerText={headerText}
      pText={pText}
      cardMaxWidth="max-w-2xl"
    >
      {/* Toggle */}
      <div className="flex w-full bg-surface-container rounded-full p-1 mb-0.5">
        <button
          type="button"
          onClick={() => navigate(`/${signInLink}`)}
          className="flex-1 py-2.5 text-[13px] lg:text-[14px] font-semibold rounded-full transition-all text-primary hover:bg-surface-variant cursor-pointer"
        >
          Login
        </button>
        <button
          type="button"
          className="flex-1 py-2.5 text-[13px] lg:text-[14px] font-semibold rounded-full transition-all bg-primary text-white shadow-sm"
        >
          Register
        </button>
      </div>

      {/* Brand Header */}
      <BrandHeader
        size="medium"
        title="Create Account"
        subtitle="Join our medical community"
        onNavigateHome={() => navigate("/")}
      />

      {/* Primary Action: Google */}
      {!isGoogleSignup && (
        <div className="mt-3 mb-1">
          <GoogleButton 
            disabled={isLoading} 
            isPrimary 
            requiredRole={requiredRole === "Doctor" ? "Doctor" : "Patient"}
            onSuccess={(res) => {
              if (res.isNewUser) {
                setIsGoogleSignup(true);
                setGoogleToken(res.googleToken || res.googleEmail);
                setForm(prev => ({ 
                  ...prev, 
                  fullName: res.googleName || prev.fullName, 
                  email: res.googleEmail || prev.email 
                }));
              } else {
                navigate(`/${continueDataLink}`, { state: { fromSignIn: true } });
              }
            }}
            onError={() => setLocalError("Google signup failed")}
          />
        </div>
      )}

      {/* Divider */}
      <Divider />

      {/* Form */}
      <form
        className="flex flex-col gap-1.5 lg:gap-2"
        onSubmit={handleSignup}
        noValidate
      >
        {localError && <ErrorBanner message={localError} />}

        {/* Full Name */}
        <FormField
          id="fullName"
          label="Full Name"
          icon={
            <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-lg" />
          }
          placeholder="John Doe"
          type="text"
          value={form.fullName}
          onChange={handleInputChange}
          disabled={isLoading}
          borderClass={getInputBorderClass("fullName")}
          error={errors.fullName}
        />

        {/* Email */}
        <FormField
          id="email"
          label="Email Address"
          icon={
            <MdOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-lg" />
          }
          placeholder="name@example.com"
          type="email"
          value={form.email}
          onChange={handleInputChange}
          disabled={isLoading || isGoogleSignup}
          borderClass={getInputBorderClass("email")}
          error={errors.email}
        />

        {/* Phone Number */}
        <FormField
          id="phoneNumber"
          label="Phone Number"
          icon={
            <MdPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-lg" />
          }
          placeholder="+201012345678"
          type="tel"
          value={form.phoneNumber}
          onChange={handleInputChange}
          disabled={isLoading}
          borderClass={getInputBorderClass("phoneNumber")}
          error={errors.phoneNumber}
        />

        {/* Passwords Side-by-Side */}
        {!isGoogleSignup && (
          <div className="flex flex-col sm:flex-row gap-3">
            <PasswordField
              id="password"
              label="Password"
              value={form.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              borderClass={getInputBorderClass("password")}
              error={errors.password}
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={handleInputChange}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              borderClass={getInputBorderClass("confirmPassword")}
              error={errors.confirmPassword}
            />
          </div>
        )}

        {/* Submit */}
        <button
          className="cursor-pointer mt-0 w-full h-10 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 rounded-xl text-[13px] lg:text-[14px] leading-[20px] tracking-[0.01em] font-semibold transition-all shadow-floating disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          type="submit"
          disabled={isLoading}
        >
          <span>{isLoading ? "Creating Account..." : "Sign Up"}</span>
          {!isLoading && <MdArrowForward className="text-md lg:text-lg" />}
        </button>
      </form>

      {/* Footer */}
      <TermsFooter actionText="creating an account" />
    </AuthLayout>
  );
}