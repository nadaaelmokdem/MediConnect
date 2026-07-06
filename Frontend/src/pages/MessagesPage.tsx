import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatService from "../services/chatService";
import { onUserPresenceChanged, subscribeToPresence } from "../services/chatHubService";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentSessions: any[] = [];
    setLoading(true);
    ChatService.getSessions()
      .then((data) => {
        setSessions(data);
        currentSessions = data;
        data.forEach(s => {
          subscribeToPresence(s.otherPartyUserId).catch(console.error);
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load messages.");
        setLoading(false);
      });

    const handlePresence = (userId: string, isOnline: boolean) => {
      setOnlineUsers(prev => ({ ...prev, [userId]: isOnline }));
    };

    onUserPresenceChanged(handlePresence);

    return () => {
      currentSessions.forEach(s => {
        import("../services/chatHubService").then(m => m.unsubscribeFromPresence(s.otherPartyUserId).catch(() => {}));
      });
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2A2455]">Messages</h1>
        <p className="text-[#2A2455]/60 text-sm">Your active conversations</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6E1FF] shadow-sm p-6 min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#6A5ACD]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-16 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50">💬</span>
            </div>
            <p className="text-lg">No active messages.</p>
            <p className="text-sm opacity-70">Chats will appear here when you start a consultation.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => navigate(`/chat/${session.sessionId}`)}
                className="flex items-start gap-4 p-4 hover:bg-[#F8F7FF] rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#E6E1FF] group"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#E6E1FF] text-[#6A5ACD] flex items-center justify-center font-bold text-lg">
                    {session.otherPartyName.charAt(0).toUpperCase()}
                  </div>
                  {onlineUsers[session.otherPartyUserId] && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-white rounded-full shadow-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-bold text-base text-[#2A2455] truncate group-hover:text-[#6A5ACD] transition-colors">
                      {session.otherPartyName}
                    </div>
                    <div className="text-xs font-medium text-gray-400 whitespace-nowrap ml-3">
                      {session.lastMessageTime
                        ? new Date(session.lastMessageTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {session.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
