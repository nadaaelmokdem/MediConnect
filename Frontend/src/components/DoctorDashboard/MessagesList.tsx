import { HiOutlineChatAlt2 } from 'react-icons/hi';
import type { ChatMessage } from '../../types/DoctorDashboard';

interface MessagesListProps {
  messages: ChatMessage[];
  onMessageClick: (id: number) => void;
}

export default function MessagesList({ messages, onMessageClick }: MessagesListProps) {
  return (
    <section className="bg-white rounded-xl shadow-ambient-card border border-surface-variant flex-1 flex flex-col hover:shadow-ambient-float transition-shadow duration-300">
      <div className="p-md border-b border-surface-variant">
        <h3 className="font-label-md text-label-md text-custom-text flex items-center gap-xs">
          <HiOutlineChatAlt2 className="text-[18px] text-tertiary" />
          Recent Messages
        </h3>
      </div>
      <div className="p-0 flex-1 divide-y divide-surface-variant">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => onMessageClick(message.id)}
            className="p-md flex items-center gap-sm transition-colors cursor-pointer hover:bg-custom-light-bg"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm">
                {message.initials}
              </div>
              {message.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-xs">
                <p className="font-label-sm text-label-sm text-custom-text truncate">
                  {message.name}
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  {message.time}
                </p>
              </div>
              <p className="font-body-sm text-[13px] truncate text-on-surface-variant">
                {message.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}