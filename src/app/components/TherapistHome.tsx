import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SlidersHorizontal, Bell, X, Plus, UserPlus, Edit2, Trash2, User } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { getPatientsByTherapist, getAllExercises } from "../../services/dbService";
import { fallbackExercises } from "../data/fallbackExercises";

const patientImages = [
  "https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=200",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=200",
];

export function TherapistHome() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [recentExercises, setRecentExercises] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const pts = await getPatientsByTherapist(user.uid);
        setPatients(pts);
      }
      
      const allEx = await getAllExercises();
      const merged = [...allEx, ...fallbackExercises];
      setRecentExercises(merged.slice(0, 3));
    };
    
    auth.onAuthStateChanged((user) => {
        if (user) fetchData();
    });
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/img/gosensorylogo.png" 
            alt="Go Sensory" 
            className="h-10 w-auto object-contain cursor-pointer"
            onClick={() => navigate("/therapist/home")}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Settings opened")}
            className="p-2 bg-[#9BC9BB] rounded-xl"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={() => toast.info("No new notifications")}
            className="p-2 bg-[#9BC9BB] rounded-xl"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {showNotification && (
        <div className="mx-4 mb-4 bg-[#F9DC5C] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
          <span className="text-sm font-medium">Anna Varsky's Tutor has contacted you</span>
          <button onClick={() => setShowNotification(false)} className="p-1 hover:bg-[#E5CB55] rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Patient Circles AT TOP */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {patients.map((pt, idx) => (
            <button
              key={pt.id}
              onClick={() => navigate(`/therapist/patients/${pt.id}`)}
              className="relative flex-shrink-0 group"
            >
              <ImageWithFallback
                src={pt.profilePicture || patientImages[pt.id.charCodeAt(0) % 3]}
                alt={pt.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#9BC9BB] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              />
              <div className="absolute -bottom-1 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${pt.status === "Pending" ? "bg-[#F9DC5C]" : "bg-green-500"}`} />
              </div>
            </button>
          ))}
          <button
            onClick={() => navigate("/therapist/patients")}
            className="w-16 h-16 rounded-full bg-[#9BC9BB] flex items-center justify-center flex-shrink-0 text-white hover:bg-[#8AB9AA] transition-colors shadow-[0_2px_8px_rgba(155,201,187,0.4)]"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Recent Exercises */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Exercises</h2>
          <button
            onClick={() => navigate("/therapist/exercise-library")}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            See All
          </button>
        </div>

        <div className="space-y-4">
          {recentExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-[#F0EBE3] rounded-3xl p-4 cursor-pointer hover:bg-[#E8E3D8] transition-colors shadow-sm"
              onClick={() => navigate(`/therapist/exercise/${exercise.id}`)}
            >
              <div className="flex gap-4">
                <div className="flex-1 min-w-0 flex flex-col">
                  <div>
                    <h3 className="font-medium mb-1 line-clamp-1">{exercise.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{exercise.duration || exercise.time || "N/A"}</p>
                    <div className="mb-2">
                      <span className="inline-block bg-[#E88D67] text-white text-[11px] px-3 py-1 rounded-full font-medium">
                        {exercise.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {exercise.description}
                    </p>
                  </div>

                  <div className="space-y-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() =>
                        navigate(`/therapist/exercise-library`)
                      }
                      className="w-full bg-[#9BC9BB] hover:bg-[#8AB9AA] text-gray-900 transition-colors rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-[13px] font-medium shadow-[0_2px_8px_rgba(155,201,187,0.3)]"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign to Patient
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toast.info("Edit feature coming soon for specific exercises")}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-white text-gray-700 transition-all rounded-full py-2 px-4 flex items-center justify-center gap-1.5 text-[13px] font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <ImageWithFallback
                  src={exercise.imageUrl || exercise.steps?.[0]?.image || "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400"}
                  alt={exercise.name}
                  className="w-[100px] h-full min-h-[160px] rounded-2xl object-cover flex-shrink-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#9BC9BB]" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>

      <BottomNav userType="therapist" />
    </div>
  );
}