import { CachedImage } from "../components/common/CachedImage";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCalendarToday,
  MdChatBubble,
  MdAutoAwesome,
  MdHealthAndSafety,
  MdSend,
  MdEventBusy,
  MdAttachFile,
  MdClose,
  MdArrowOutward
} from "react-icons/md";
import { getFileUrl } from "../utils/fileUtils";
import PatientService from "../services/patientService";
import ChatService from "../services/chatService";
import { getAiQuota } from "../services/AIChat";
import { useAuth } from "../context/AuthContext";
import type { PatientDashboardData } from "../types/dashboard";
import { formatTimeTo12Hour, formatChatSessionTime } from "../utils/dateUtils";
import { formatMessagePreview } from "../utils/textUtils";
import Skeleton from "../components/common/Skeleton";
import NetworkError from "../components/common/NetworkError";

const REVIEW_DISMISSED_KEY = 'review_dismissed_appointment_ids';

// Single source of truth for the "premium" card elevation used across the
// dashboard. Previously this long arbitrary shadow value was duplicated
// (with slightly different neighboring classes) in five separate places.
const CARD_SHADOW =
  "shadow-[0_12px_24px_-4px_rgba(42,36,85,0.08),0_4px_12px_-2px_rgba(42,36,85,0.04)]";
const CARD_BASE = `${CARD_SHADOW} rounded-xl border border-surface-variant/60 transition-shadow duration-300 hover:shadow-[0_16px_32px_-4px_rgba(42,36,85,0.12),0_6px_16px_-2px_rgba(42,36,85,0.06)]`;

function getDismissedReviewIds(): number[] {
  try {
    const stored = localStorage.getItem(REVIEW_DISMISSED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function dismissReview(appointmentId: number) {
  const dismissedIds = getDismissedReviewIds();
  if (!dismissedIds.includes(appointmentId)) {
    dismissedIds.push(appointmentId);
    localStorage.setItem(REVIEW_DISMISSED_KEY, JSON.stringify(dismissedIds));
  }
}

interface StarRatingProps {
  rating: number;
  onRate: (rating: number, comment: string) => void;
}

function StarRating({ rating, onRate }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex gap-1 text-amber-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-4xl transition-colors ${
            star <= (hoveredRating || rating)
              ? 'text-amber-500'
              : 'text-surface-variant'
          } hover:text-amber-400 focus:outline-none`}
          onClick={() => onRate(Number(star), '')}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

interface SystemMessageComponentProps {
  doctorName: string;
  doctorId?: string | number;
  doctorProfilePictureUrl?: string;
  onRate: (rating: number, comment: string) => void;
  onDiscard: () => void;
}

export function SystemMessageComponent({ doctorName, doctorId, doctorProfilePictureUrl, onRate, onDiscard }: SystemMessageComponentProps) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const fallbackInitial = doctorName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase() || 'D';

  return (
    <div className={`${CARD_BASE} p-6 bg-surface-container-lowest flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
            {doctorProfilePictureUrl ? (
              <CachedImage
                src={doctorProfilePictureUrl}
                alt={doctorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{fallbackInitial}</span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-on-surface text-base leading-snug">Rate your visit</h4>
            {doctorId ? (
              <button
                type="button"
                onClick={() => navigate(`/doctors/${doctorId}`)}
                className="group inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline underline-offset-2 decoration-primary/50 transition-colors focus:outline-none focus:underline"
                title={`View Dr. ${doctorName}'s profile`}
              >
                Dr. {doctorName}
                <MdArrowOutward className="text-[13px] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>
            ) : (
              <p className="text-xs text-on-surface-variant font-medium">Dr. {doctorName}</p>
            )}
          </div>
        </div>
        <button
          onClick={onDiscard}
          className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-full hover:bg-error/10 shrink-0"
          aria-label="Dismiss"
        >
          <MdClose className="text-lg" />
        </button>
      </div>

      {/* Rating Input */}
      <div className="flex items-center justify-center py-3 mb-4 rounded-lg border border-surface-variant/60 bg-surface-dim/10">
        <StarRating rating={rating} onRate={(val) => setRating(val)} />
      </div>

      {/* Optional Comment Input */}
      <div className="flex-grow mb-4">
        <textarea
          rows={2}
          className="w-full h-full min-h-[60px] border border-surface-variant/60 rounded-lg p-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-on-surface-variant/50"
          placeholder="Share your experience (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={() => rating > 0 && onRate(rating, comment)}
        disabled={rating === 0}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all ${
          rating > 0
            ? 'bg-primary text-on-primary hover:shadow-md hover:bg-primary-dark'
            : 'bg-surface-variant/50 text-on-surface-variant/50 cursor-not-allowed'
        }`}
      >
        Submit Feedback
      </button>
    </div>
  );
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [aiQuota, setAiQuota] = useState<{ freeAiMessages: number, premiumAiMessages: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [dismissedSystemMessages, setDismissedSystemMessages] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dismissed_system_messages') || '[]') as string[];
    } catch {
      return [];
    }
  });

  const handleAiSubmit = () => {
    if (!aiPrompt.trim()) return;
    navigate('/ai-chat', { state: { initialPrompt: aiPrompt } });
  };

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setLoading(true);
        setError(null);
        setData(null);
        setRecentChats([]);
        setAiQuota(null);
      }
    }, 0);

    Promise.all([
      PatientService.getDashboard(),
      ChatService.getSessions(user?.activeRole),
      getAiQuota()
    ])
      .then(([dashboardData, chatSessions, quotaData]) => {
        setData(dashboardData);
        setRecentChats(chatSessions.slice(0, 5));
        setAiQuota(quotaData);
      })
      .catch((err) => { if (active) setError(err.message ?? "Failed to load dashboard"); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [user?.id, user?.activeRole]);

  const availableAppointment = data?.unreviewedAppointments?.find(
    a => !getDismissedReviewIds().includes(a.appointmentId) && !dismissedSystemMessages.includes(`system_msg_${a.doctorId}`)
  );
  const showSystemMessage = !!availableAppointment;
  const systemMessageDoctor = availableAppointment?.doctorName || '';
  const reviewAppointment = availableAppointment || null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReviewSubmit = async (appointmentId: number, rating: number, comment: string) => {
    try {
      await PatientService.submitReview(appointmentId, rating, comment);
      dismissReview(appointmentId);
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          unreviewedAppointments: prev.unreviewedAppointments.filter(a => a.appointmentId !== appointmentId)
        };
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    }
  };

  const handleSystemMessageDiscard = (doctorId: number) => {
    const key = `system_msg_${doctorId}`;
    if (!dismissedSystemMessages.includes(key)) {
      const updated = [...dismissedSystemMessages, key];
      setDismissedSystemMessages(updated);
      localStorage.setItem('dismissed_system_messages', JSON.stringify(updated));
    }
  };

  const handleSystemMessageRate = (rating: number, comment: string) => {
    if (reviewAppointment) {
      handleReviewSubmit(reviewAppointment.appointmentId, rating, comment);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 max-w-[1440px] z-10 relative">
        <Skeleton className="h-48 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Skeleton className="col-span-1 md:col-span-12 h-40" />
          <Skeleton className="col-span-1 md:col-span-6 h-64" />
          <Skeleton className="col-span-1 md:col-span-6 h-64" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-8 max-w-[1440px] z-10 relative flex items-center justify-center min-h-[50vh]">
        <NetworkError />
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <main className="flex-1 p-8 max-w-[1440px] z-10 relative bg-background text-on-background min-h-screen">
      {/* Welcome Hero */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-on-surface">
            {getGreeting()}, {data.fullName.split(' ')[0]}.
          </h1>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <MdCalendarToday className="text-xl" />
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
        </div>

        <div className={`relative overflow-hidden ${CARD_BASE} h-48 group`}>
          <img
            alt="Find Doctors"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src="find-doctors.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent"></div>
          <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8 text-on-primary">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Find the right care</h2>
            <p className="text-sm md:text-base mb-4 opacity-90 max-w-md">Search through our network of certified specialists and book your next appointment instantly.</p>
            <button
              onClick={() => navigate('/doctors')}
              className="cursor-pointer w-fit px-4 py-1.5 md:px-6 md:py-2 bg-surface-container-lowest text-primary rounded-lg text-xs md:text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
            >
              Search Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Care Partner Widget (AI) */}
        <div className={`relative z-0 mb-2 bg-surface-container-lowest rounded-xl p-6 flex flex-col h-full w-full transition-all duration-300 ${CARD_SHADOW} ${
          showSystemMessage && systemMessageDoctor ? 'col-span-1 md:col-span-12 lg:col-span-8' : 'col-span-1 md:col-span-12'
        }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <MdAutoAwesome className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-on-surface">Tabibi AI</h3>
                  <p className="text-xs font-medium text-primary flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                  {aiQuota && (
                    <div className="hidden sm:flex items-center gap-1.5 mr-1 px-3 py-1.5 rounded-full bg-surface-container-high border border-surface-variant/60">
                      <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap">
                        {aiQuota.freeAiMessages} free left
                      </span>
                      {aiQuota.premiumAiMessages > 0 && (
                        <span className="text-xs font-semibold text-primary whitespace-nowrap">
                           +{aiQuota.premiumAiMessages}
                        </span>
                      )}
                    </div>
                  )}
                  <button onClick={() => navigate('/ai-chat')} className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/5 border border-primary/20 text-primary rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary/10 transition-colors shadow-sm whitespace-nowrap">
                    <MdHealthAndSafety className="text-base sm:text-lg" />
                    <span>Start Check</span>
                  </button>
              </div>
            </div>

            {/* Mini Chat Area */}
            <div className="flex-grow bg-surface-dim/10 rounded-xl p-4 mb-4 border border-surface-variant/60 flex flex-col gap-4 justify-end shadow-inner">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm border border-primary/10">
                  <MdAutoAwesome className="text-base" />
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-2xl rounded-bl-sm border border-surface-variant/60 max-w-[85%] shadow-sm">
                  <p className="text-sm text-on-surface leading-relaxed font-medium">
                    Hello! I'm your Tabibi AI assistant. Please describe your symptoms in as much detail as possible, including when they started.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative mt-2 flex items-center bg-surface-container-high rounded-xl border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all pl-2 shadow-sm">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    navigate('/ai-chat', { state: { initialPrompt: aiPrompt, attachedFile: file } });
                  }
                  if (e.target) e.target.value = "";
                }}
              />
              <button onClick={() => fileInputRef.current?.click()} className="cursor-pointer p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full shrink-0" title="Attach file">
                <MdAttachFile className="text-xl" />
              </button>
              <input
                className="flex-1 p-3.5 bg-transparent border-none text-base text-on-surface outline-none placeholder-on-surface-variant/70 min-w-0"
                placeholder="Type your health concern or attach a report..."
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
              />
              <button onClick={handleAiSubmit} className="cursor-pointer p-4 text-primary hover:text-primary/80 transition-colors shrink-0">
                <MdSend className="text-xl" />
              </button>
            </div>
        </div>

        {/* Dynamic Feedback Widget (1/3 Width on Desktop, Stacked on Mobile/Tablet) */}
        {showSystemMessage && systemMessageDoctor && (
          <div className="col-span-1 md:col-span-12 lg:col-span-4 transition-all duration-300">
            <SystemMessageComponent
              doctorName={systemMessageDoctor}
              doctorId={reviewAppointment?.doctorId}
              doctorProfilePictureUrl={reviewAppointment?.doctorProfilePictureUrl}
              onRate={handleSystemMessageRate}
              onDiscard={() => handleSystemMessageDiscard(reviewAppointment?.doctorId || 0)}
            />
          </div>
        )}

        {/* Upcoming Appointments */}
        <div className={`col-span-1 md:col-span-6 lg:col-span-6 bg-surface-container-lowest ${CARD_BASE} p-6 flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-on-surface">Upcoming Appointments</h2>
              {data.upcomingAppointmentsCount > 0 && <span className="text-sm font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{data.upcomingAppointmentsCount} total</span>}
            </div>
            <button onClick={() => navigate('/patient-appointments')} className="cursor-pointer text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4 flex-1">
            {data.upcomingAppointments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <MdEventBusy className="text-4xl text-on-surface-variant/30 mb-2" />
                <p className="text-sm text-on-surface-variant/80 text-center mb-4">
                  No upcoming appointments yet.
                </p>
                <button onClick={() => navigate('/doctors')} className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors">
                  <MdCalendarToday className="text-lg" />
                  Book an appointment
                </button>
              </div>
            ) : (
              data.upcomingAppointments.map((a, i) => (
                <div key={a.appointmentId}>
                  <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-surface-variant/60 cursor-pointer">
                    {a.doctorProfilePictureUrl ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                          <CachedImage
                            src={getFileUrl(a.doctorProfilePictureUrl)}
                            alt={a.doctorName || "Doctor"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm text-lg font-bold">
                          {(a.doctorName || "D").replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase() || "D"}
                        </div>
                      )}
                    <div className="flex-1">
                      <h4 className="text-base text-on-surface font-semibold">
                        {(a.doctorName || "").startsWith("Dr.") ? a.doctorName : `Dr. ${a.doctorName || "Doctor"}`}
                      </h4>
                      <p className="text-sm text-on-surface-variant">{a.consultationType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-on-surface font-semibold">
                        {new Date(a.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}, {formatTimeTo12Hour(new Date(a.scheduledAt))}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-xs font-medium rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {a.status}
                      </span>
                    </div>
                  </div>
                  {i < data.upcomingAppointments.length - 1 && <hr className="border-surface-variant/60 mt-4" />}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Chats */}
        <div className={`col-span-1 md:col-span-6 lg:col-span-6 bg-surface-container-lowest ${CARD_BASE} p-6 flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-on-surface">Recent Chats</h2>
              {data.chatSessionsCount > 0 && (
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {data.chatSessionsCount} chats
                </span>
              )}
            </div>
            <button onClick={() => navigate('/chat')} className="cursor-pointer text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4 flex-1">
            {recentChats.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center py-8">
                <MdChatBubble className="text-4xl text-on-surface-variant/30 mb-2" />
                <p className="text-sm text-on-surface-variant/80 text-center">
                  No recent chats.
                </p>
               </div>
            ) : (
              recentChats.map((session, i) => (
                <div key={session.sessionId}>
                  <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-surface-variant/60 cursor-pointer" onClick={() => navigate(session.otherPartyUserId === 'AI' ? `/ai-chat/${session.sessionId}` : `/chat/${session.sessionId}`)}>
                    <div className="relative shrink-0">
                      {session.otherPartyProfilePictureUrl ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                          <CachedImage
                            src={getFileUrl(session.otherPartyProfilePictureUrl)}
                            alt={session.otherPartyName || "Doctor"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm text-lg font-bold">
                          {(session.otherPartyName || "D").replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase() || "D"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-base text-on-surface font-semibold truncate">
                          {session.otherPartyUserId === 'AI' || (session.otherPartyName || "").startsWith("Dr.") ? (session.otherPartyName || "AI") : `Dr. ${session.otherPartyName || "Doctor"}`}
                        </h4>
                        <span className="text-xs text-on-surface-variant font-medium shrink-0 ml-2">{session.lastMessageTime ? formatChatSessionTime(session.lastMessageTime) : ''}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant truncate">{formatMessagePreview(session.lastMessage) || "No messages yet"}</p>
                    </div>
                  </div>
                  {i < recentChats.length - 1 && <hr className="border-surface-variant/60 mt-4" />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}