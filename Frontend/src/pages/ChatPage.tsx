import React, { useState, useRef, useEffect } from 'react';
import AIChat from '../services/AIChat';
import { 
  FiChevronLeft, 
  FiPhone, 
  FiVideo, 
  FiPaperclip, 
  FiImage, 
  FiSend
} from 'react-icons/fi';
import type Contact from '../types/Contact';
import type Message from '../types/Message';

const CURRENT_USER_ID = 'user1';

const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Gemini', avatar: 'https://brandlogos.net/wp-content/uploads/2025/03/gemini_icon-logo_brandlogos.net_aacx5-768x768.png', lastMessage: '', time: 'Now', unread: 0, online: true },
];

export default function ChatPage() {
  const [activeContact] = useState<Contact>(CONTACTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = newMessage.trim();
    if (!trimmedText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      text: trimmedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context: ""
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');

    try {
      const prevText = messages.length > 0 ? messages[messages.length - 2].text : '';
      const aiResponse = await AIChat(trimmedText, prevText);
      const aiMessage: Message = {
      id: Date.now().toString(),
      senderId: "c1",
      text: aiResponse["user_facing_reply"],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context: aiResponse["clinical_assessment"]
    };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl overflow-hidden bg-white sm:rounded-2xl border border-slate-100">
      <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-slate-50/50 h-full`}>
        <div className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-6 flex-shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileListVisible(true)}
              className="mr-3 md:hidden rounded-full p-2 text-slate-400 hover:bg-slate-50"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <img src={activeContact.avatar} alt={activeContact.name} className="h-7 w-7 rounded-full object-cover" />
            <div className="ml-4">
              <h2 className="font-bold text-slate-800">{activeContact.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                {activeContact.online ? (
                  <><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-slate-300"></span> Offline</>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isMe = msg.senderId === CURRENT_USER_ID;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <img 
                    src={activeContact.avatar} 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full object-cover mr-3 self-end mb-1" 
                  />
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                  <div 
                    className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' 
                        : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100'
                    }`}
                  >
                    <p className="text-[14px] sm:text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-3 sm:p-4 border-t border-slate-100 flex-shrink-0">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center bg-slate-50 rounded-full px-2 py-1.5 sm:py-2 border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
          >
            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors hidden sm:block">
              <FiPaperclip className="h-5 w-5" />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <FiImage className="h-5 w-5" />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent px-3 py-2 outline-none text-slate-700 placeholder:text-slate-400 text-sm"
            />
            
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className={`ml-2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all ${
                newMessage.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FiSend className="h-4 w-4 sm:ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}