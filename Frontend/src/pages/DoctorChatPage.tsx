import { useAuth } from "../context/AuthContext";
import DoctorMessagesPage from "./DoctorMessagesPage";
import UserDoctorChatsPage from "./UserDoctorChatsPage";

export default function DoctorChatPage() {
  const { user } = useAuth();

  if (user?.activeRole?.toLowerCase() === "doctor") {
    return <DoctorMessagesPage />;
  }

  return <UserDoctorChatsPage />;
}
