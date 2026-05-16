import { NavLink } from "react-router-dom";
import { 
  LuCalendarDays, 
  LuFolderHeart, 
  LuCreditCard, 
  LuMessageSquare, 
  LuLayoutDashboard,
  LuCircle,
  LuLogOut
} from "react-icons/lu";
import { type IconType } from "react-icons";

// Define the shape of our navigation items
interface NavItem {
  name: string;
  icon: IconType;
  path: string;
}

const navItems: NavItem[] = [
  { name: "Appointments", icon: LuCalendarDays, path: "/appointments" },
  { name: "Medical Records", icon: LuFolderHeart, path: "/records" },
  { name: "Billing", icon: LuCreditCard, path: "/billing" },
  { name: "Messages", icon: LuMessageSquare, path: "/messages" },
  { name: "Doctor DoctorDashboard", icon: LuLayoutDashboard, path: "/doctor-dashboard" },
];

export default function Sidebar() {
  return (
    <nav className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-semibold fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none z-40">
      <div className="flex flex-col justify-between h-full p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img 
              alt="Doctor Avatar" 
              className="w-12 h-12 rounded-full object-cover shadow-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBntAs1gxA_2x1EGovvCHIAC65R6l7-HtTkBq6ec6IgYikiiACdsML40XTnvtKk1Qk3bxRfEgof9zQ6YBiFXEDYX34r70UTIlyvrJ2EELryTiBqxXRrWkDA8APNR4bU5wouRXRFhEw2Gc2pW-9MDcmpbesvFLNg9QMjxmBghtaW0Oj7p6H6u5EuuUHegep2eJeANZH1MeZ10PeWCOp2cloTNECdEXzc-lBVeC6V7FTJ20N5ATblS2wZAUe3ZOqX1rQAYllS78Y00sA"
            />
            <div>
              <h2 className="text-lg font-bold text-indigo-600">MediConnect Portal</h2>
              <p className="text-xs text-slate-500 font-normal">Empathetic Care</p>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out active:scale-95 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border-r-4 border-indigo-600"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`
              }
            >
              <item.icon className="text-lg" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-colors active:scale-95 flex items-center justify-center gap-2">
            Book Consultation
          </button>
          
          <div className="space-y-1">
            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 ease-in-out active:scale-95" href="#help">
              <LuCircle className="text-lg" />
              <span>Help Center</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 ease-in-out active:scale-95" href="#logout">
              <LuLogOut className="text-lg" />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}