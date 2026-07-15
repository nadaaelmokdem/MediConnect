import { MdChatBubble } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CachedImage } from "../../../components/common/CachedImage";
import { getFileUrl } from "../../../utils/fileUtils";
import { formatChatSessionTime } from "../../../utils/dateUtils";

interface DoctorDashboardMessagesProps {
  sessions: any[];
  isVerified: boolean;
  onlineUsers: Record<string, boolean>;
  userRole: string;
  formatLastMessagePreview: (lastMsg: string, role: string | undefined | null, viewerRole: string) => string;
}

export default function DoctorDashboardMessages({
  sessions,
  isVerified,
  onlineUsers,
  userRole,
  formatLastMessagePreview
}: DoctorDashboardMessagesProps) {
  const navigate = useNavigate();

  return (
    <div className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-xl p-6 shadow-[0_12px_24px_-4px_rgba(42,36,85,0.08),0_4px_12px_-2px_rgba(42,36,85,0.04)] border border-surface-variant/30 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-on-surface">Recent Messages</h2>
          {sessions.length > 0 && (
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {sessions.length} chats
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/chat")}
          className="cursor-pointer text-sm font-medium text-primary hover:underline"
        >
          View all
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {sessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-8">
            <MdChatBubble className="text-4xl text-on-surface-variant/30 mb-2" />
            <p className="text-sm text-on-surface-variant/80 text-center">
              {isVerified
                ? "No active chat sessions."
                : "Patient chats will be available once your profile is verified."}
            </p>
          </div>
        ) : (
          sessions.map((session, i) => (
            <div key={session.sessionId}>
              <div
                onClick={() => navigate(`/chat/${session.sessionId}`)}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-surface-variant/30 cursor-pointer"
              >
                <div className="relative shrink-0">
                  {session.otherPartyProfilePictureUrl ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                      <CachedImage
                        src={getFileUrl(session.otherPartyProfilePictureUrl)}
                        alt={session.otherPartyName || "User"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm text-lg font-bold">
                      {(session.otherPartyName || "U").charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {onlineUsers[session.otherPartyUserId] && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-base text-on-surface font-semibold truncate">
                      {session.otherPartyName || "User"}
                    </h4>
                    <span className="text-[12px] text-on-surface-variant font-medium ml-2 shrink-0">
                      {session.lastMessageTime
                        ? formatChatSessionTime(session.lastMessageTime)
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant truncate">
                    {formatLastMessagePreview(
                      session.lastMessage,
                      session.lastMessageRole,
                      userRole,
                    ) || "No messages yet"}
                  </p>
                </div>
              </div>
              {i < sessions.length - 1 && (
                <hr className="border-surface-variant/30 mt-4" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
