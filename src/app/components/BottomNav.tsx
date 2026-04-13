import { Home, Users, Library, MessageSquare, Calendar, User as UserIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";

interface BottomNavProps {
  userType?: "therapist" | "caregiver";
}

export function BottomNav({ userType = "therapist" }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const isActive = (path: string) => location.pathname === path;
  const baseRoute = userType === "therapist" ? "/therapist" : "/caregiver";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#E8E4DB] border-t border-gray-200">
      <div className="max-w-md mx-auto flex items-center justify-around py-3 px-4">
        <button
          onClick={() => navigate(`${baseRoute}/home`)}
          className={`flex flex-col items-center gap-1 p-2 rounded-full transition-colors ${
            isActive(`${baseRoute}/home`) ? "bg-[#9BC9BB]" : ""
          }`}
        >
          <Home className="w-6 h-6" />
        </button>
        {userType === "therapist" ? (
          <button
            onClick={() => navigate(`${baseRoute}/patient-list`)}
            className={`flex flex-col items-center gap-1 p-2 rounded-full transition-colors ${
              isActive(`${baseRoute}/patient-list`) ? "bg-[#9BC9BB]" : ""
            }`}
          >
            <Users className="w-6 h-6" />
          </button>
        ) : null}
        <button
          onClick={() => navigate(`${baseRoute}/exercise-library`)}
          className={`flex flex-col items-center gap-1 p-2 rounded-full transition-colors ${
            isActive(`${baseRoute}/exercise-library`) ? "bg-[#9BC9BB]" : ""
          }`}
        >
          <Library className="w-6 h-6" />
        </button>
        <button 
          onClick={() => navigate(`${baseRoute}/calendar`)}
          className={`flex flex-col items-center gap-1 p-2 rounded-full transition-colors ${
            isActive(`${baseRoute}/calendar`) ? "bg-[#9BC9BB]" : ""
          }`}
        >
          <Calendar className="w-6 h-6" />
        </button>
        <button 
          onClick={() => navigate(`${baseRoute}/messages`)}
          className={`flex flex-col items-center gap-1 p-2 rounded-full transition-colors ${
            isActive(`${baseRoute}/messages`) ? "bg-[#9BC9BB]" : ""
          }`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate(`${baseRoute}/my-profile`)}
          className={`flex flex-col items-center gap-1 p-1 rounded-full transition-all ${
            isActive(`${baseRoute}/my-profile`) ? "ring-2 ring-[#9BC9BB] ring-offset-2 scale-110" : ""
          }`}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className={`p-1.5 rounded-full ${isActive(`${baseRoute}/my-profile`) ? "bg-transparent" : "bg-gray-200"}`}>
              <UserIcon className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </button>
      </div>
    </nav>
  );
}