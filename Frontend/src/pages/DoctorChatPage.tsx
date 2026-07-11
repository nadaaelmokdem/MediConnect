import { CachedImage } from "../components/common/CachedImage";
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatService from "../services/chatService";
import { useChatSession } from "../hooks/useChatSession";
import { MessageBubble, ChatInput } from "../components/Chat/MainContent";
import type Message from "../types/Message";
import type Contact from "../types/Contact";
import { onUpdateSessionList, offUpdateSessionList } from "../services/chatHubService";
import type { ReceivedMessage } from "../types/ReceivedMessage";
import { FaUserMd, FaUsers, FaRegClock, FaChevronRight } from "react-icons/fa";
import { TbArrowLeft, TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import Swal from "sweetalert2";
import { formatTimeTo12Hour, formatChatSessionTime } from "../utils/dateUtils";
import { formatMessagePreview } from "../utils/textUtils";
import Skeleton from "../components/common/Skeleton";
import NetworkError from "../components/common/NetworkError";
import { getFileUrl } from "../utils/fileUtils";

interface SessionInfo {
  sessionId: number;
  otherPartyName: string;
  otherPartyUserId: string;
  otherPartySpecialty?: string;
  lastMessage: string;
  lastMessageTime: string | null;
  doctorId?: number;
  otherPartyProfilePictureUrl?: string;
}

interface GroupedContact {
  id: string;
  name: string;
  specialty?: string;
  avatar?: string;
  latestMessageTime: number;
  sessions: SessionInfo[];
}

export default function DoctorChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [activeTab, setActiveTab] = useState<"contacts" | "recent">("recent");
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [includeAI, setIncludeAI] = useState(false);

  const numericSessionId = sessionId ? Number(sessionId) : undefined;
  const isDoctor = user?.activeRole?.toLowerCase() === "doctor";

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setSessions([]);
        setExpandedContactId(null);
      }
    }, 0);

    const fetchSessions = () => {
      ChatService.getSessions(user?.activeRole).then(data => {
        let filteredSessions = data;
        if (isDoctor) {
          filteredSessions = data.filter((s: any) => s.lastMessage && s.lastMessage.trim() !== "");
        } else {
          if (!includeAI) {
            filteredSessions = data.filter((s: any) => s.otherPartyUserId !== "AI" && s.otherPartyName !== "AI Medical Assistant");
          }
        }
        if (active) setSessions(filteredSessions);
      }).catch(console.error);
    };

    fetchSessions();

    const handleUpdateSessionList = (payload: ReceivedMessage) => {
      if (!isDoctor && !includeAI) {
        if (payload.senderRole === "AI" || (payload as any).senderId === "AI" || payload.senderRole === "System") return;
      }

      setSessions((prev) => {
        const idx = prev.findIndex(s => s.sessionId === payload.sessionId);
        if (idx === -1) {
          fetchSessions();
          return prev;
        }
        const updatedSession = { 
          ...prev[idx], 
          lastMessage: payload.content, 
          lastMessageTime: payload.sentAt 
        };
        const newArr = [...prev];
        newArr.splice(idx, 1);
        newArr.unshift(updatedSession);
        return newArr;
      });
    };
    
    onUpdateSessionList(handleUpdateSessionList);
    return () => {
      active = false;
      offUpdateSessionList(handleUpdateSessionList);
    };
  }, [user?.id, user?.activeRole, isDoctor, includeAI]);

  const recentSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return timeB - timeA;
    });
  }, [sessions]);

  const groupedContacts = useMemo(() => {
    const map = new Map<string, GroupedContact>();
    sessions.forEach(s => {
      if (!map.has(s.otherPartyUserId)) {
        map.set(s.otherPartyUserId, {
          id: s.otherPartyUserId,
          name: isDoctor || s.otherPartyUserId === "AI" ? s.otherPartyName : (s.otherPartyName.startsWith("Dr.") ? s.otherPartyName : `Dr. ${s.otherPartyName}`),
          specialty: s.otherPartySpecialty,
          avatar: s.otherPartyProfilePictureUrl,
          latestMessageTime: s.lastMessageTime ? new Date(s.lastMessageTime).getTime() : 0,
          sessions: []
        });
      }
      const group = map.get(s.otherPartyUserId)!;
      group.sessions.push(s);
      const sTime = s.lastMessageTime ? new Date(s.lastMessageTime).getTime() : 0;
      if (sTime > group.latestMessageTime) {
        group.latestMessageTime = sTime;
      }
    });

    const groups = Array.from(map.values());
    groups.forEach(g => {
      g.sessions.sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      });
    });

    return groups.sort((a, b) => b.latestMessageTime - a.latestMessageTime);
  }, [sessions, isDoctor]);

  useEffect(() => {
    if (numericSessionId && sessions.length > 0) {
      const session = sessions.find(s => s.sessionId === numericSessionId);
      if (session) {
        setTimeout(() => setExpandedContactId(session.otherPartyUserId), 0);
      }
    }
  }, [numericSessionId, sessions]);

  return (
    <main className="flex-1 flex overflow-hidden max-w-[1440px] mx-auto w-full h-[calc(100dvh-64px)] lg:h-dvh bg-[#fcf8ff]">
      
      {/* Left Sidebar */}
      <aside className={`
        flex flex-col bg-white border-r border-[#e5deff] transition-all duration-300 ease-in-out shrink-0
        ${isSidebarOpen 
          ? `w-full md:w-[350px] lg:w-[400px] translate-x-0 ${numericSessionId ? 'hidden md:flex' : 'flex'}`
          : `w-0 overflow-hidden border-none -translate-x-full md:translate-x-0 hidden md:flex`
        }
      `}>
        <div className="p-4 border-b border-[#e5deff] w-full md:w-[350px] lg:w-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#1a1345] flex items-center gap-2">
              <FaUserMd className="text-[#6a5acd]" /> {isDoctor ? "My Patients" : "Chats"}
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="cursor-pointer p-2 -mr-2 text-[#474553] hover:bg-[#eae5ff] hover:text-[#5140b3] rounded-lg transition-colors hidden md:block"
            >
              <TbLayoutSidebarLeftCollapse className="text-[20px]" />
            </button>
          </div>
          
          <div className="flex bg-[#f8f7ff] rounded-lg p-1 gap-1 border border-[#e5deff] mb-3">
            <button 
              onClick={() => setActiveTab("contacts")}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === "contacts" ? 'bg-white text-[#6a5acd] shadow-sm border border-[#e5deff]' : 'text-[#787584] hover:text-[#1a1345]'}`}
            >
              <FaUsers /> {isDoctor ? "By Patient" : "By Doctor"}
            </button>
            <button 
              onClick={() => setActiveTab("recent")}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === "recent" ? 'bg-white text-[#6a5acd] shadow-sm border border-[#e5deff]' : 'text-[#787584] hover:text-[#1a1345]'}`}
            >
              <FaRegClock /> Recent
            </button>
          </div>

          {!isDoctor && (
            <div className="flex items-center justify-end px-1 pb-1">
              <label className="flex items-center cursor-pointer relative">
                <span className="mr-2 text-sm font-medium text-[#474553]">Include AI</span>
                <input 
                  type="checkbox" 
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${includeAI ? 'bg-[#6a5acd]' : 'bg-gray-300'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full mt-[3px] ml-1 shadow-sm transform transition-transform ${includeAI ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeTab === "recent" && (
            recentSessions.length === 0 ? (
              <p className="text-center text-[#787584] text-sm mt-6">No recent messages.</p>
            ) : (
              recentSessions.map(session => (
                <div 
                  key={session.sessionId}
                  onClick={() => navigate(`/chat/${session.sessionId}`)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${numericSessionId === session.sessionId ? 'bg-[#f0ebff] border-[#b8a7ff]' : 'bg-white border-[#f0ebff] hover:border-[#b8a7ff] hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <span className="font-bold text-[#1a1345] text-sm break-words whitespace-normal">
                      {!isDoctor && session.otherPartyUserId !== "AI" && !session.otherPartyName.startsWith("Dr.") ? `Dr. ${session.otherPartyName}` : session.otherPartyName}
                    </span>
                    <span className="text-xs font-medium text-[#787584] shrink-0">
                      {session.lastMessageTime ? formatChatSessionTime(session.lastMessageTime) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-[#474553] line-clamp-2">{formatMessagePreview(session.lastMessage) || "No messages"}</p>
                </div>
              ))
            )
          )}

          {activeTab === "contacts" && (
            groupedContacts.length === 0 ? (
              <p className="text-center text-[#787584] text-sm mt-6">No chats found.</p>
            ) : (
              groupedContacts.map(contact => (
                <div key={contact.id} className={`bg-white rounded-xl transition-all border ${expandedContactId === contact.id ? 'border-[#b8a7ff] shadow-sm mb-3' : 'border-[#f0ebff] mb-2 hover:border-[#b8a7ff]'}`}>
                  <button 
                    onClick={() => setExpandedContactId(expandedContactId === contact.id ? null : contact.id)}
                    className="w-full p-4 flex justify-between items-center bg-transparent transition-colors rounded-xl"
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-[#1a1345] text-[15px] break-words whitespace-normal">{contact.name}</span>
                      {contact.specialty && (
                        <span className="text-[12px] font-medium text-[#787584] mt-0.5">{contact.specialty}</span>
                      )}
                      <span className="text-[13px] font-medium text-[#6a5acd] mt-1">{contact.sessions.length} Session{contact.sessions.length !== 1 ? 's' : ''}</span>
                    </div>
                    <FaChevronRight className={`text-[#474553] text-sm transition-transform ${expandedContactId === contact.id ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {expandedContactId === contact.id && (
                    <div className="bg-[#f8f7ff] p-3 border-t border-[#e5deff] space-y-2 rounded-b-xl">
                      {contact.sessions.map((session, idx) => (
                        <div 
                          key={session.sessionId}
                          onClick={() => navigate(`/chat/${session.sessionId}`)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors border ${numericSessionId === session.sessionId ? 'bg-white border-[#6a5acd] shadow-sm' : 'bg-white border-[#e5deff] hover:border-[#b8a7ff]'}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-bold ${numericSessionId === session.sessionId ? 'text-[#6a5acd]' : 'text-[#1a1345]'}`}>Session {contact.sessions.length - idx}</span>
                            <span className="text-[11px] font-semibold text-[#787584] bg-[#eae5ff] px-2 py-0.5 rounded-full">
                              {session.lastMessageTime ? formatChatSessionTime(session.lastMessageTime) : 'New'}
                            </span>
                          </div>
                          <p className="text-xs text-[#474553] line-clamp-1 font-medium">{formatMessagePreview(session.lastMessage) || "No messages"}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </aside>

      {/* Right Chat Pane */}
      <section className={`flex-1 flex flex-col bg-[#fcf8ff] relative min-w-0 ${!numericSessionId ? 'hidden md:flex' : 'flex'}`}>
        {numericSessionId ? (
          <ActiveChatPane 
            numericSessionId={numericSessionId} 
            navigate={navigate}
            onBack={() => navigate('/chat')} 
            isSidebarOpen={isSidebarOpen}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            isDoctor={isDoctor}
            sessions={sessions}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
             {!isSidebarOpen && (
               <button
                 className="absolute top-4 left-4 cursor-pointer p-2 text-[#474553] hover:text-[#5140b3] hover:bg-[#eae5ff] rounded-lg transition-colors hidden md:block"
                 onClick={() => setIsSidebarOpen(true)}
               >
                 <TbLayoutSidebarRightCollapse className="text-[24px]" />
               </button>
             )}
             <div className="w-24 h-24 bg-[#f0ebff] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[#e5deff]">
               <FaUserMd className="text-4xl text-[#6a5acd]" />
             </div>
             <h3 className="text-2xl font-extrabold text-[#1a1345] mb-2 tracking-tight">{isDoctor ? "Doctor Messages" : "Chats"}</h3>
             <p className="text-[#474553] max-w-md font-medium text-sm leading-relaxed">Select a {isDoctor ? "patient" : "doctor or AI chat"} or a recent consultation session from the sidebar to view the conversation and reply.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function ActiveChatPane({ 
  numericSessionId, 
  navigate,
  onBack,
  isSidebarOpen,
  onOpenSidebar,
  isDoctor,
  sessions
}: { 
  numericSessionId: number;
  navigate: (path: string) => void;
  onBack: () => void;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  isDoctor: boolean;
  sessions: SessionInfo[];
}) {
  const { user } = useAuth();
  const { messages, loading, error, send, sessionDetails, isOtherUserOnline } = useChatSession(numericSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => Date.now());

  const [assessmentVisible, setAssessmentVisible] = useState(true);
  const currentUserId = user?.id;

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  const displayMessages: Message[] = useMemo(
    () =>
      messages.map((m) => ({
        id: String(m.messageId),
        senderId: m.senderUserId || m.senderRole || "",
        text: m.content,
        timestamp: formatTimeTo12Hour(new Date(m.sentAt)),
      })),
    [messages]
  );

  const contact: Contact = useMemo(() => {
    let name = "Contact";
    if (isDoctor) {
      name = sessionDetails?.patientName || "Patient";
    } else {
      name = sessionDetails?.doctorName || "Doctor";
      if (!name.startsWith("Dr.") && name !== "AI Medical Assistant") {
        name = `Dr. ${name}`;
      }
    }
    const session = sessions.find(s => s.sessionId === numericSessionId);
    return {
      id: numericSessionId.toString(),
      name,
      avatar: session?.otherPartyProfilePictureUrl || "",
      lastMessage: "",
      time: "",
      unread: 0,
      online: isOtherUserOnline,
      specialty: sessionDetails?.doctorSpecialty || "",
      doctorId: sessionDetails?.doctorId
    };
  }, [numericSessionId, sessionDetails, isOtherUserOnline, isDoctor, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const showAssessmentButton = useMemo(() => {
    if (isDoctor) return false;
    if (!assessmentVisible) return false;
    const clinicalAssessment = localStorage.getItem("clinical_assessment");
    return !!clinicalAssessment && contact.name !== "AI Medical Assistant";
  }, [assessmentVisible, isDoctor, contact.name]);

  const handleSendAssessment = () => {
    const assessment = localStorage.getItem("clinical_assessment");
    if (!assessment) return;
    Swal.fire({
      title: "AI Clinic Assessment",
      html: `<div class="text-left bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto text-gray-700 font-medium">${assessment}</div>`,
      showCancelButton: true,
      confirmButtonText: "Send to Doctor",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: 'bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100',
        title: 'text-2xl font-bold mb-4 text-gray-800 text-left w-full',
        htmlContainer: 'w-full m-0',
        confirmButton: 'w-full mt-6 bg-[#6a5acd] hover:bg-[#5b4eb8] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg',
        cancelButton: 'w-full mt-3 py-3 text-gray-500 font-semibold hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors',
        actions: 'flex flex-col gap-0 w-full mt-2'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await send(`Clinical Assessment:\n${assessment}`);
        localStorage.removeItem("clinical_assessment"); 
        setAssessmentVisible(false);
      }
    });
  };

  if (loading) return <div className="flex-1 p-8"><Skeleton className="h-full min-h-[400px] w-full" /></div>;
  if (error) return <div className="flex-1 flex items-center justify-center"><NetworkError message={error} /></div>;

  return (
    <>
      <div className="bg-white px-4 sm:px-6 py-4 border-b border-[#e5deff] flex items-center gap-3 sticky top-0 z-20 shadow-sm shrink-0">
        <button onClick={onBack} className="md:hidden text-[#474553] p-1 -ml-2 rounded-lg hover:bg-[#eae5ff] transition-colors">
          <TbArrowLeft className="text-2xl" />
        </button>
        {!isSidebarOpen && (
          <button
            className="hidden md:block cursor-pointer p-2 -ml-2 mr-1 text-[#474553] hover:text-[#5140b3] hover:bg-[#eae5ff] rounded-lg transition-colors"
            onClick={onOpenSidebar}
          >
            <TbLayoutSidebarRightCollapse className="text-[24px]" />
          </button>
        )}
        <div className="flex items-center gap-3">
          {contact.avatar ? (
            <div className="w-11 h-11 rounded-full overflow-hidden shadow-md border-2 border-white">
              <CachedImage
                src={getFileUrl(contact.avatar)}
                alt={contact.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8a7cf0] to-[#6a5acd] text-white flex items-center justify-center font-bold shadow-md text-lg border-2 border-white">
               {contact.name.replace("Dr. ", "").charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-extrabold text-[#1a1345] leading-tight text-[17px]">
              {!isDoctor && contact.doctorId && contact.name !== "AI Medical Assistant" ? (
                <span 
                  onClick={() => navigate(`/doctors/${contact.doctorId}`)} 
                  className="hover:underline hover:text-[#6a5acd] cursor-pointer"
                  title="View Profile"
                >
                  {contact.name}
                </span>
              ) : (
                contact.name
              )}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${contact.online ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-400"}`}></span>
              <span className="text-[12px] font-semibold text-[#787584]">
                {contact.online ? "Online" : "Offline"}
              </span>
              {!isDoctor && contact.specialty && (
                <>
                  <span className="text-[#e5deff]">|</span>
                  <span className="text-[12px] font-semibold text-[#6a5acd]">{contact.specialty}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 bg-[#fcf8ff]">
        {!isDoctor && sessionDetails?.isCompanyPaid && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg text-sm mb-2 text-center">
            You can only send exactly one message. Make sure to describe your issue completely.
          </div>
        )}

        {sessionDetails && new Date(sessionDetails.startedAt).getTime() < now - 24 * 60 * 60 * 1000 && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-2 text-center shadow-sm">
            <strong className="block mb-1 text-base font-bold">Session Expired</strong>
            This 24-hour consultation session has expired. {isDoctor ? "The patient must initiate a follow-up." : ""}
            {!isDoctor && (
              <div className="mt-3">
                <button 
                  onClick={async () => {
                    try {
                      await ChatService.followUp(numericSessionId);
                      window.location.reload();
                    } catch (e: any) {
                      alert(e.response?.data || "Failed to initiate follow up.");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Pay 40% Follow-Up Fee to Resume
                </button>
              </div>
            )}
          </div>
        )}
        
        {sessionDetails?.isFollowUp && (
          <div className="bg-[#e5efff] border border-[#b8d4ff] text-[#0055ff] p-2 rounded-lg text-xs mb-2 text-center font-bold tracking-wide uppercase">
            Follow-Up Session
          </div>
        )}

        {displayMessages.length === 0 ? (
          <p className="text-sm text-[#787584] text-center mt-8 font-medium">
            No messages yet.
          </p>
        ) : (
          displayMessages.map((msg) => {
            const isMine = msg.senderId === currentUserId || msg.senderId === user?.id;
            return <MessageBubble key={msg.id} msg={msg} isMe={isMine} />;
          })
        )}
        <div ref={messagesEndRef} className="h-2 sm:h-4" />
      </div>

      {showAssessmentButton && (
        <div className="bg-[#f3f0ff] border-t border-[#e5deff] p-3 flex justify-center items-center shrink-0">
          <button 
            onClick={handleSendAssessment}
            className="flex items-center gap-2 bg-[#6a5acd] hover:bg-[#5b4eb8] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Send Latest AI Assessment
          </button>
        </div>
      )}

      <ChatInput 
        onSendMessage={send} 
        isLoading={false} 
        acceptedFileTypes=".jpg,.jpeg,.png,.webp,.heic,.heif,.mp4,.mov,.avi,.webm,.wmv,.mpeg,.mpg,.flv,.3gpp,.pdf"
        disabled={sessionDetails ? (
          (new Date(sessionDetails.startedAt).getTime() < now - 24 * 60 * 60 * 1000) || 
          (!isDoctor && sessionDetails.isCompanyPaid && displayMessages.filter(m => m.senderId === currentUserId && !m.text.startsWith("Clinical Assessment:")).length >= 1)
        ) : false} 
        onFileUpload={async (file, onProgress) => {
          return await ChatService.uploadFile(file, (e: any) => {
            if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
          });
        }}
      />
    </>
  );
}
