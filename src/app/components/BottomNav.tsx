import { Home, Users, Library, MessageSquare, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BottomNavProps {
  userType?: "therapist" | "caregiver";
}

export function BottomNav({ userType = "therapist" }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const baseRoute = userType === "therapist" ? "/therapist" : "/caregiver";

  const profileAvatar = userType === "therapist"
    ? "https://images.unsplash.com/photo-1612944095914-33fd0a85fcfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
    : "https://images.unsplash.com/photo-1663045281813-c7407a6ec613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200";

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
            isActive(`${baseRoute}/my-profile`) ? "ring-2 ring-[#9BC9BB] ring-offset-2" : ""
          }`}
        >
          <ImageWithFallback
            src={profileAvatar}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>
      </div>
    </nav>
  );
}