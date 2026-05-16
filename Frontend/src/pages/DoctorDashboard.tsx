import { useState } from 'react';
import { MdAttachMoney, MdHourglassEmpty, MdCalendarMonth, MdChevronRight, MdDescription, MdChatBubble } from 'react-icons/md';
import StatCard from '../components/DoctorDashboard/StatCard';
import ScheduleItemComponent, { type ScheduleItem } from '../components/DoctorDashboard/ScheduleItem';
import RequestItemComponent from '../components/DoctorDashboard/RequestItem';
import CalendarModal from '../components/DoctorDashboard/CalendarModal';
import ChatBox from '../components/DoctorDashboard/ChatBox';
import { getTodayStr, sortSchedule } from '../utils/dateUtils';
import { initialSchedule, initialRequests, initialMessages } from '../data/dummyData.ts';

interface RequestItem {
  id: number;
  name: string;
  time: string;
  timeDisplay: string;
  concern: string;
  initials: string;
}

interface ChatMessage {
  id: number;
  name: string;
  text: string;
  time: string;
  initials: string;
  isOnline: boolean;
}

export default function Dashboard() {
  const [activeChat, setActiveChat] = useState<ChatMessage | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [messages] = useState<ChatMessage[]>(initialMessages);

  const handleCancelAppointment = (id: number) => {
    if (window.confirm('Cancel this appointment?')) {
      setSchedule(schedule.filter((s) => s.id !== id));
    }
  };

  const handleAccept = (req: RequestItem) => {
    setRequests(requests.filter((r) => r.id !== req.id));
    setSchedule([
      ...schedule,
      {
        id: Date.now(),
        time: req.time,
        duration: '30 min',
        name: req.name,
        type: 'New Consultation',
        badge: 'Video',
        date: getTodayStr(),
        initials: req.initials,
      },
    ]);
  };

  const handleReschedule = (id: number) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const todayAppointments = schedule.filter((s) => s.date === getTodayStr()).length;

  return (
    <div className="w-full bg-[#FBFAFF] p-4 md:p-8 min-h-screen relative">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Earnings"
          value="7,450 EGP"
          trend="+12% this week"
          icon={MdAttachMoney}
        />
        <StatCard
          title="Pending Consultations"
          value={requests.length}
          subtext="Requires action"
          icon={MdHourglassEmpty}
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments}
          subtext="Next slot in 45m"
          icon={MdCalendarMonth}
          isPrimary
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Daily Schedule Section */}
        <div className="xl:col-span-2 bg-white rounded-[1.5rem] border border-[#E6E1FF] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#2A2455]">Daily Schedule</h3>
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="text-[#6A5ACD] text-sm font-bold flex items-center gap-1 hover:underline"
            >
              View Calendar <MdChevronRight size={16} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {sortSchedule(schedule).map((item) => (
              <ScheduleItemComponent
                key={item.id}
                item={item}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Patient Requests */}
          <div className="bg-white rounded-[1.5rem] border border-[#E6E1FF] shadow-sm p-6">
            <h3 className="font-bold mb-6 flex items-center justify-between text-[#2A2455]">
              <div className="flex items-center gap-2">
                <MdDescription size={18} className="text-[#6A5ACD]" /> Patient Requests
              </div>
              <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-full">{requests.length} New</span>
            </h3>
            {requests.map(req => (
              <RequestItemComponent key={req.id} req={req} onAccept={handleAccept} onReschedule={handleReschedule} />
            ))}
            <button className="w-full text-center mt-2 text-sm font-bold text-[#6A5ACD] hover:underline pt-2 border-t border-gray-50">
              View All Requests
            </button>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-[1.5rem] border border-[#E6E1FF] shadow-sm p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-[#2A2455]">
               <MdChatBubble size={18} className="text-[#6A5ACD]" /> Recent Messages
            </h3>
            <div className="flex flex-col">
              {messages.map(msg => (
                <div key={msg.id} onClick={() => setActiveChat(msg)} className="flex items-start gap-3 p-3 hover:bg-[#F8F7FF] rounded-xl transition-all cursor-pointer border-b border-gray-50 last:border-0 group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#E6E1FF] text-[#6A5ACD] flex items-center justify-center font-bold text-xs">{msg.initials}</div>
                    {msg.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div className="font-bold text-xs text-[#2A2455] truncate group-hover:text-[#6A5ACD] transition-colors">{msg.name}</div>
                      <div className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{msg.time}</div>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        schedule={schedule}
        onCancelAppointment={handleCancelAppointment}
      />
      <ChatBox activeChat={activeChat} onClose={() => setActiveChat(null)} />
    </div>
  );
}