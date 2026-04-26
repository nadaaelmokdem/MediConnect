import React, { useState, useRef, useEffect } from 'react';
import AIChat from '../services/AIChat';
import { FiImage, FiSend, FiUser, FiInfo, FiMenu, FiX } from 'react-icons/fi';
import type Contact from '../types/Contact';
import type Message from '../types/Message';
import { MdOutlineAccountBalanceWallet, MdSmartToy } from 'react-icons/md';
import { FaStethoscope } from 'react-icons/fa';

const CURRENT_USER_ID = 'user1';

const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'AI Medical Assistant',
    avatar: '',
    lastMessage: 'Based on the visual aura symptoms...',
    time: 'Now',
    unread: 0,
    online: true,
  },
];

// Typing indicator component
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#474553] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </span>
  );
}

export default function ChatPage() {
  const [activeContact] = useState<Contact>(CONTACTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for mobile sidebar
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`;
    }
  }, [newMessage]);

  const handleSendMessage = async () => {
    const trimmedText = newMessage.trim();
    if (!trimmedText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      text: trimmedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context: '',
    };

    const lastAiMessage = [...messages].reverse().find((m) => m.senderId === 'c1');
    const prevContext = lastAiMessage ? lastAiMessage.context : '';

    const aiMessageId = (Date.now() + 1).toString();
    const placeholderAiMessage: Message = {
      id: aiMessageId,
      senderId: 'c1',
      text: '...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context: '',
    };

    setMessages((prev) => [...prev, userMessage, placeholderAiMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const finalResponse = await AIChat(trimmedText, prevContext);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: finalResponse.user_facing_reply,
                context: finalResponse.clinical_assessment || '',
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Request failed:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: 'Error: Could not reach the server.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const wordCount = newMessage.trim() === '' ? 0 : newMessage.trim().split(/\s+/).length;
  const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const todayLabel = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <main className="flex-1 flex overflow-hidden max-w-[1280px] mx-auto w-full flex-grow relative">
      {/* Mobile Sidebar Overlay/Backdrop */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-[#1a1345]/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside 
        className={`
          absolute lg:relative z-50 left-0 top-0 bottom-0
          w-[85%] sm:w-80 border-r border-[#e5deff] bg-[#ffffff] flex flex-col h-[calc(100dvh-70px)]
          transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        {/* Mobile Sidebar Header (Close Button) */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-[#e5deff]">
          <span className="font-manrope font-semibold text-[#1a1345] text-[18px]">Menu</span>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="cursor-pointer p-2 text-[#474553] hover:bg-[#eae5ff] hover:text-[#5140b3] rounded-lg transition-colors"
          >
            <FiX className="text-[20px]" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="p-4 lg:p-[24px] border-b border-t border-[#e5deff] flex flex-col gap-[12px]">
          <button 
            className="cursor-pointer w-full bg-[#6a5acd] text-[#f0ebff] rounded-lg px-[16px] py-[12px] flex items-center justify-center gap-[4px] font-inter text-[14px] leading-[1] tracking-[0.02em] font-semibold hover:bg-[#5140b3] hover:text-[#ffffff] transition-colors shadow-[0px_4px_20px_rgba(42,36,85,0.05)]"
            onClick={() => { /* Add logic, then close sidebar if mobile */ setIsSidebarOpen(false); }}
          >
            <MdSmartToy className="text-[18px]" />
            New AI Chat
          </button>
          <button 
            className="cursor-pointer w-full bg-[#eae5ff] text-[#1a1345] rounded-lg px-[16px] py-[12px] flex items-center justify-center gap-[4px] font-inter text-[14px] leading-[1] tracking-[0.02em] font-semibold hover:bg-[#e5deff] transition-colors"
            onClick={() => { /* Add logic, then close sidebar if mobile */ setIsSidebarOpen(false); }}
          >
            <FaStethoscope className="text-[18px]" />
            New Doctor Chat
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-[16px] flex flex-col gap-[12px]">
          <p className="font-inter text-[12px] leading-[1] font-medium text-[#474553] px-[4px] uppercase tracking-wider">
            Recent Consultations
          </p>

          <div className="bg-[#eae5ff] rounded-lg p-[12px] cursor-pointer border-l-4 border-[#5140b3]">
            <div className="flex items-center gap-[4px] mb-[4px]">
              <MdSmartToy className="text-[#5140b3] text-[18px]" />
              <span className="p-1 font-inter text-[14px] leading-[1] tracking-[0.02em] font-semibold text-[#1a1345] line-clamp-1">Migraine Assessment</span>
            </div>
            <p className="p-1 font-inter text-[14px] leading-[1.5] font-normal text-[#474553] line-clamp-1">Based on the visual aura symptoms...</p>
            <p className="p-1 font-inter text-[12px] leading-[1] font-medium text-[#787584] mt-[4px] text-right">Today, 10:42 AM</p>
          </div>

          <div className="bg-[#ffffff] hover:bg-[#f6f1ff] transition-colors rounded-lg p-[12px] cursor-pointer border border-[#e5deff]">
            <div className="flex items-center gap-[4px] mb-[4px]">
              <FiUser className="text-[#6252a3] text-[18px]" />
              <span className="p-1 font-inter text-[14px] leading-[1] tracking-[0.02em] font-semibold text-[#1a1345] line-clamp-1">Dr. Sarah Jenkins</span>
            </div>
            <p className="p-1 font-inter text-[14px] leading-[1.5] font-normal text-[#474553] line-clamp-1">Your lab results look normal. I recommend...</p>
            <p className="p-1 font-inter text-[12px] leading-[1] font-medium text-[#787584] mt-[4px] text-right">Yesterday</p>
          </div>
        </div>
      </aside>

      {/* ── Chat Area ────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col bg-[#fcf8ff] relative h-[calc(100dvh-70px)] min-w-0">
        {/* Header */}
        <header className="bg-[#ffffff] border-b border-[#e5deff] px-4 sm:px-[24px] py-[12px] sm:py-[16px] flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shrink-0 shadow-[0px_4px_20px_rgba(42,36,85,0.05)] z-10">
          <div className="flex items-center gap-[12px]">
            {/* Mobile Sidebar Toggle Button */}
            <button 
              className="cursor-pointer lg:hidden p-2 -ml-2 text-[#474553] hover:text-[#5140b3] hover:bg-[#eae5ff] rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu className="text-[24px]" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#6a5acd] flex items-center justify-center text-[#f0ebff] shrink-0 hidden sm:flex">
              <MdSmartToy className="text-[20px]" />
            </div>
            <div>
              <h2 className="font-manrope text-[18px] sm:text-[24px] leading-[1.4] font-semibold text-[#1a1345] line-clamp-1">
                {activeContact.name}
              </h2>
              <div className="flex items-center gap-[4px]">
                <div className="w-2 h-2 rounded-full bg-[#b8a7ff]"></div>
                <span className="font-inter text-[12px] leading-[1] font-medium text-[#474553]">Active Session</span>
              </div>
            </div>
          </div>

          {/* Responsive Progress Area */}
          <div className="flex flex-1 sm:flex-none items-center justify-end sm:justify-start gap-3 sm:gap-6 bg-[#FBFAFF] border border-[#E6E1FF] px-3 sm:px-5 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm w-full sm:w-fit">
            <div className="hidden lg:flex items-center gap-2">
              <MdOutlineAccountBalanceWallet className="text-[18px] text-[#474553]" />
              <p className="text-sm text-[#474553]">Message usage</p>
            </div>
            
            {/* AI Progress */}
            <div className="flex flex-col gap-1.5 w-full sm:w-24 md:w-32">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-[#2A2455] uppercase tracking-wide">
                <span>AI</span>
                <span>5/15</span>
              </div>
              <div className="h-1.5 sm:h-2 w-full bg-[#E6E1FF] rounded-full overflow-hidden">
                <div className="h-full bg-[#6A5ACD] rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>

            {/* Doctor Progress */}
            <div className="flex flex-col gap-1.5 w-full sm:w-24 md:w-32">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-[#2A2455] uppercase tracking-wide">
                <span>Doc</span>
                <span>2/5</span>
              </div>
              <div className="h-1.5 sm:h-2 w-full bg-[#E6E1FF] rounded-full overflow-hidden">
                <div className="h-full bg-[#2A2455] rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </header>

        {/* Notice bar */}
        <div className="bg-[#b8a7ff]/20 border-b border-[#b8a7ff]/30 px-4 sm:px-[24px] py-[6px] sm:py-[4px] flex justify-center items-center shrink-0 z-10">
          <p className="font-inter text-[12px] sm:text-[14px] leading-[1.4] sm:leading-[1.5] font-normal text-[#474553] text-center flex items-start sm:items-center gap-[6px] sm:gap-[4px]">
            <FiInfo className="text-[14px] sm:text-[16px] shrink-0 mt-0.5 sm:mt-0" />
            Keep it brief to maximize your usage. For urgent matters, seek immediate human consultation.
          </p>
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-[24px] flex flex-col gap-4 sm:gap-[24px]">
          {/* Initial timestamp */}
          <div className="flex justify-center">
            <span className="bg-[#e5deff] text-[#474553] font-inter text-[10px] sm:text-[12px] leading-[1] font-medium px-[10px] sm:px-[12px] py-[4px] rounded-full">
              {todayLabel}, {nowLabel}
            </span>
          </div>

          {/* Welcome message (always shown) */}
          <div className="flex gap-[12px] sm:gap-[16px] max-w-[95%] sm:max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-[#6a5acd] flex items-center justify-center text-[#f0ebff] shrink-0 mt-[4px]">
              <MdSmartToy className="text-[18px]" />
            </div>
            <div className="bg-[#ffffff] border border-[#e5deff] rounded-2xl rounded-tl-sm p-3 sm:p-[16px] shadow-[0px_4px_20px_rgba(42,36,85,0.05)]">
              <p className="font-inter text-[14px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] font-normal text-[#1a1345]">
                Hello. I'm your Tabibi AI assistant. Please describe your symptoms in as much detail as possible, including when they started.
              </p>
            </div>
          </div>

          {/* Dynamic messages */}
          {messages.map((msg) => {
            const isMe = msg.senderId === CURRENT_USER_ID;
            const isTyping = msg.text === '...';

            return (
              <div
                key={msg.id}
                className={`flex gap-[12px] sm:gap-[16px] ${isMe ? 'max-w-[95%] sm:max-w-[85%] self-end flex-row-reverse' : 'max-w-[95%] sm:max-w-[85%]'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-[4px] ${
                    isMe
                      ? 'bg-[#e5deff] text-[#474553]'
                      : 'bg-[#6a5acd] text-[#f0ebff]'
                  }`}
                >
                  {isMe ? <FiUser className="text-[18px]" /> : <MdSmartToy className="text-[18px]" />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl p-3 sm:p-[16px] shadow-[0px_4px_20px_rgba(42,36,85,0.05)] ${
                      isMe
                        ? 'bg-[#5140b3] text-[#ffffff] rounded-tr-sm'
                        : 'bg-[#ffffff] border border-[#e5deff] text-[#1a1345] rounded-tl-sm'
                    }`}
                  >
                    {isTyping && !isMe ? (
                      <TypingDots />
                    ) : (
                      <p className={`font-inter text-[14px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] font-normal whitespace-pre-wrap ${isMe ? '' : 'text-[#1a1345]'}`}>
                        {msg.text}
                      </p>
                    )}
                  </div>
                  <span className="font-inter text-[10px] sm:text-[12px] leading-[1] font-medium text-[#787584] mt-[4px] px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} className="h-2 sm:h-4" />
        </div>

        {/* Input area */}
        <div className="bg-[#ffffff] border-t border-[#e5deff] p-3 sm:p-[16px] shrink-0 shadow-[0px_-4px_20px_rgba(42,36,85,0.03)] z-10 pb-safe">
          <div className="max-w-4xl mx-auto flex flex-col gap-[4px]">
            <div className="relative flex items-center gap-[8px] sm:gap-[12px] bg-[#f6f1ff] rounded-xl border border-[#e5deff] focus-within:border-[#5140b3] focus-within:ring-1 focus-within:ring-[#5140b3] transition-all p-[4px]">
              {/* Image button */}
              <button
                type="button"
                className="cursor-pointer p-2 sm:p-[12px] text-[#474553] hover:text-[#5140b3] transition-colors shrink-0 rounded-lg hover:bg-[#eae5ff]"
                title="Upload Image"
              >
                <FiImage className="h-5 w-5" />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none max-h-32 min-h-[44px] py-[10px] sm:py-[12px] px-[4px] font-inter text-[14px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] font-normal text-[#1a1345] placeholder-[#474553]/50"
              />

              {/* Send button */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="cursor-pointer p-2 sm:p-[12px] mb-0.5 sm:mb-0 bg-[#5140b3] text-[#ffffff] hover:bg-[#5d4cbf] transition-colors shrink-0 rounded-lg shadow-[0px_4px_20px_rgba(42,36,85,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <FiSend className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="flex justify-end px-[4px]">
              <span className="font-inter text-[10px] sm:text-[12px] leading-[1] font-medium text-[#787584]">{wordCount} / 500 words</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}