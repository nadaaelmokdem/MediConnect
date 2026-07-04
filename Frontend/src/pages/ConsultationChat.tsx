import { useParams } from "react-router-dom";
import { useMemo, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChatSession } from "../hooks/useChatSession";
import { MessageBubble, ChatInput } from "../components/Chat/MainContent";
import type Message from "../types/Message";

export default function ConsultationChat() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const numericSessionId = Number(sessionId);
  const { messages, loading, error, connected, send, sessionDetails, isOtherUserOnline } = useChatSession(numericSessionId);

  // user.userType is "user" (patient) or "doctor" per AppUser typing -
  // map that onto the SenderRole strings the backend uses.
  const myRole = user?.activeRole?.toLowerCase() === "doctor" ? "Doctor" : "User";

  const displayMessages: Message[] = useMemo(
    () =>
      messages.map((m) => ({
        id: String(m.messageId),
        senderId: m.senderRole, // "User" | "Doctor" - only two participants, so this is enough to distinguish sides
        text: m.content,
        timestamp: new Date(m.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    [messages]
  );

  const otherPartyName = useMemo(() => {
    if (sessionDetails) {
      return myRole === "Doctor" ? sessionDetails.patientName : sessionDetails.doctorName;
    }
    const theirMessage = messages.find((m) => m.senderRole !== myRole);
    return theirMessage?.senderName ?? (myRole === "User" ? "Doctor" : "User");
  }, [messages, myRole, sessionDetails]);

  const specialty = sessionDetails && myRole === "User" ? sessionDetails.doctorSpecialty : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  if (!sessionId || Number.isNaN(numericSessionId)) {
    return <div className="p-8 text-[#2A2455]/60">Invalid chat session.</div>;
  }

  if (loading) {
    return <div className="p-8 text-[#2A2455]/60">Loading conversation...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-[#2A2455]/60">
        Couldn't load this chat. {error}
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden max-w-[900px] mx-auto w-full h-[calc(100dvh-70px)]">
      <div className="px-4 sm:px-6 py-3 border-b border-[#e5deff] bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#e5deff] flex items-center justify-center text-[#1a1345] font-bold text-lg">
            {otherPartyName?.charAt(0)?.toUpperCase() || "U"}
            <div 
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOtherUserOnline ? 'bg-green-500' : 'bg-gray-400'}`} 
              title={isOtherUserOnline ? "Online" : "Offline"} 
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-[#1a1345] leading-tight">
              {otherPartyName}
            </h1>
            {specialty ? (
              <span className="text-xs text-[#787584] mt-0.5">{specialty}</span>
            ) : (
              <span className="text-xs text-[#787584] mt-0.5">
                {isOtherUserOnline ? "Active now" : "Offline"}
              </span>
            )}
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            connected ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {connected ? "Connected" : "Connecting..."}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 bg-[#fcf8ff]">
        {displayMessages.length === 0 ? (
          <p className="text-sm text-[#787584] text-center mt-8">
            No messages yet - say hello to start the conversation.
          </p>
        ) : (
          displayMessages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === myRole} />
          ))
        )}
        <div ref={messagesEndRef} className="h-2 sm:h-4" />
      </div>

      <ChatInput onSendMessage={send} isLoading={false} />
    </main>
  );
}
