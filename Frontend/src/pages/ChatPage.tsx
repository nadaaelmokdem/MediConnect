import { useState, useRef, useEffect } from 'react';
import AIChat from '../services/AIChat';
import { FiInfo} from 'react-icons/fi';
import { MdSmartToy } from 'react-icons/md';
import type Contact from '../types/Contact';
import type Message from '../types/Message';
import Sidebar from '../components/Chat/Sidebar';
import ChatHeader from '../components/Chat/Header';
import { ChatInput, MessageBubble } from '../components/Chat/MainContent';
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

export default function ChatPage() {
  const [activeContact] = useState<Contact>(CONTACTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const trimmedText = text.trim();
    
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
    setIsLoading(true);

    try {
      const finalResponse = await AIChat(trimmedText, prevContext ?? "");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: finalResponse.user_facing_reply, context: finalResponse.clinical_assessment || '' }
            : msg
        )
      );
    } catch (error) {
      console.error('Request failed:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, text: 'Error: Could not reach the server.' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const todayLabel = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <main className="flex-1 flex overflow-hidden max-w-[1280px] mx-auto w-full flex-grow relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <section className="flex-1 flex flex-col bg-[#fcf8ff] relative h-[calc(100dvh-70px)] min-w-0">
        <ChatHeader contact={activeContact} onOpenSidebar={() => setIsSidebarOpen(true)} />

        <div className="bg-[#b8a7ff]/20 border-b border-[#b8a7ff]/30 px-4 sm:px-[24px] py-[6px] sm:py-[4px] flex justify-center items-center shrink-0 z-10">
          <p className="text-[12px] sm:text-[14px] leading-[1.4] sm:leading-[1.5] font-normal text-[#474553] text-center flex items-start sm:items-center gap-[6px] sm:gap-[4px]">
            <FiInfo className="text-[14px] sm:text-[16px] shrink-0 mt-0.5 sm:mt-0" />
            Keep it brief to maximize your usage. For urgent matters, seek immediate human consultation.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-[24px] flex flex-col gap-4 sm:gap-[24px]">
          <div className="flex justify-center">
            <span className="bg-[#e5deff] text-[#474553] text-[10px] sm:text-[12px] leading-[1] font-medium px-[10px] sm:px-[12px] py-[4px] rounded-full">
              {todayLabel}, {nowLabel}
            </span>
          </div>

          <div className="flex gap-[12px] sm:gap-[16px] max-w-[95%] sm:max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-[#6a5acd] flex items-center justify-center text-[#f0ebff] shrink-0 mt-[4px]">
              <MdSmartToy className="text-[18px]" />
            </div>
            <div className="bg-[#ffffff] border border-[#e5deff] rounded-2xl rounded-tl-sm p-3 sm:p-[16px] shadow-[0px_4px_20px_rgba(42,36,85,0.05)]">
              <p className="text-[14px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] font-normal text-[#1a1345]">
                Hello. I'm your Tabibi AI assistant. Please describe your symptoms in as much detail as possible, including when they started.
              </p>
            </div>
          </div>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === CURRENT_USER_ID} />
          ))}

          <div ref={messagesEndRef} className="h-2 sm:h-4" />
        </div>

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </section>
    </main>
  );
}