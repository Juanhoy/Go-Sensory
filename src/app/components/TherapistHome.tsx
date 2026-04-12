import { useState } from "react";
import { useNavigate } from "react-router";
import { SlidersHorizontal, Bell, X, Plus, UserPlus, Edit2, Trash2 } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

const recentExercises = [
  {
    id: 1,
    name: "Jumping Jacks x 20",
    type: "Activate",
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    image: "https://images.unsplash.com/photo-1763013259112-15f293b6d481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHBsYXlpbmclMjBzZW5zb3J5JTIwdG95c3xlbnwxfHx8fDE3NzU3Nzg3MDR8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 2,
    name: "Jumping Jacks x 20",
    type: "Activate",
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    image: "https://images.unsplash.com/photo-1763013259112-15f293b6d481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHBsYXlpbmclMjBzZW5zb3J5JTIwdG95c3xlbnwxfHx8fDE3NzU3Nzg3MDR8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 3,
    name: "Jumping Jacks x 20",
    type: "Activate",
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    image: "https://images.unsplash.com/photo-1763013259112-15f293b6d481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHBsYXlpbmclMjBzZW5zb3J5JTIwdG95c3xlbnwxfHx8fDE3NzU3Nzg3MDR8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
];

const patientImages = [
  "https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=200",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=200",
];

export function TherapistHome() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);

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
        <div className="mx-4 mb-4 bg-[#F9DC5C] rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm">Anna Varsky's Tutor has contacted you</span>
          <button onClick={() => setShowNotification(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Recent Exercises */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">Recent Exercises</h2>
          <button
            onClick={() => toast.info("Showing all exercises...")}
            className="text-sm"
          >
            See All
          </button>
        </div>

        <div className="space-y-4">
          {recentExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-[#F0EBE3] rounded-2xl p-4 cursor-pointer hover:bg-[#E8E3D8] transition-colors"
              onClick={() => navigate(`/therapist/exercise/${exercise.id}`)}
            >
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1">{exercise.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">15 min</p>
                  <div className="mb-2">
                    <span className="inline-block bg-[#E88D67] text-white text-xs px-3 py-1 rounded-full font-medium">
                      {exercise.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {exercise.description}
                  </p>

                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() =>
                        navigate(`/therapist/patients/1/schedule/${exercise.id}`)
                      }
                      className="w-full bg-[#9BC9BB] hover:bg-[#8AB9AA] transition-colors rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign to Patient
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/therapist/exercise/${exercise.id}/edit`)}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => toast.success("Exercise deleted")}
                        className="flex-1 border-2 border-red-300 hover:border-red-400 text-red-600 transition-colors rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <ImageWithFallback
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-[#9BC9BB]" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Patient Circles */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3">
          {patientImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => navigate("/therapist/patients")}
              className="relative"
            >
              <ImageWithFallback
                src={img}
                alt={`Patient ${idx + 1}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            </button>
          ))}
          <button
            onClick={() => navigate("/therapist/patients")}
            className="w-16 h-16 rounded-full bg-[#9BC9BB] flex items-center justify-center"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>

      <BottomNav userType="therapist" />
    </div>
  );
}