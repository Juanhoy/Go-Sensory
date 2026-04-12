import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, MoreVertical, Check, Plus, UserPlus, Edit2, Trash2, X, Repeat, CalendarDays } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { motion } from "motion/react";
import { BottomNav } from "./BottomNav";
import { patients } from "../data/mockData";

interface Exercise {
  id: string;
  name: string;
  duration: string;
  time: string;
  type: "Activate" | "Relaxing" | "Stimulant" | "Concentrate" | "Focus";
  description: string;
  imageUrl: string;
  isDone: boolean;
}

interface ExerciseLibraryProps {
  userType?: "therapist" | "caregiver";
}

const exercises: Exercise[] = [
  {
    id: "1",
    name: "Jumping Jacks x 20",
    duration: "Short Time",
    time: "15 min",
    type: "Activate",
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    imageUrl: "https://images.unsplash.com/photo-1633612605433-d2622726fa25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isDone: false,
  },
  {
    id: "2",
    name: "Deep Breathing x 10",
    duration: "Short Time",
    time: "10 min",
    type: "Relaxing",
    description: "This exercise will help the patient to relax and calm down their nervous system...",
    imageUrl: "https://images.unsplash.com/photo-1558525012-54a093add0f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isDone: false,
  },
  {
    id: "3",
    name: "Building Blocks Challenge",
    duration: "Medium Time",
    time: "20 min",
    type: "Concentrate",
    description: "This exercise will help the patient to improve focus and fine motor skills...",
    imageUrl: "https://images.unsplash.com/photo-1763679677841-c5cd0c12b3aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isDone: false,
  },
  {
    id: "4",
    name: "Nature Walk",
    duration: "Long Time",
    time: "30 min",
    type: "Stimulant",
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    imageUrl: "https://images.unsplash.com/photo-1772525996574-dbd5dc06f69d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isDone: false,
  },
  {
    id: "5",
    name: "Yoga Stretches",
    duration: "Medium Time",
    time: "15 min",
    type: "Relaxing",
    description: "This exercise will help the patient to relax muscles and improve flexibility...",
    imageUrl: "https://images.unsplash.com/photo-1765939928623-9d4752a5f462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isDone: false,
  },
  {
    id: "6",
    name: "Dance Party",
    duration: "Medium Time",
    time: "20 min",
    type: "Activate",
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    imageUrl: "https://images.unsplash.com/photo-1764071546563-342c0a257ebe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isDone: false,
  },
  {
    id: "7",
    name: "Puzzle Time",
    duration: "Medium Time",
    time: "25 min",
    type: "Focus",
    description: "This exercise will help the patient to improve concentration and problem-solving...",
    imageUrl: "https://images.unsplash.com/photo-1763679677841-c5cd0c12b3aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isDone: false,
  },
];

const typeColors: Record<string, string> = {
  Activate: "bg-[#E57373] text-white",
  Relaxing: "bg-[#9BC9BB] text-gray-900",
  Stimulant: "bg-[#B39DDB] text-white",
  Concentrate: "bg-[#90A4AE] text-white",
  Focus: "bg-[#FFB74D] text-gray-900",
};

export function ExerciseLibrary({ userType }: ExerciseLibraryProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [exerciseStates, setExerciseStates] = useState<{ [key: string]: boolean }>({});
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const isTherapist = userType === "therapist";

  const exerciseTypes = ["All", "Activate", "Relaxing", "Stimulant", "Focus"];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || exercise.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleDone = (id: string) => {
    setExerciseStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    toast.success(exerciseStates[id] ? "Unmarked as done" : "Marked as done");
  };

  const handleStartExercise = (exercise: Exercise) => {
    toast.success(`Starting ${exercise.name}`);
  };

  const handleAssignToPatient = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowAssignModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    toast.info(`Edit feature coming soon for: ${exercise.name}`);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    toast.success("Exercise deleted successfully");
  };

  const handleCreateExercise = () => {
    toast.info("Create exercise feature coming soon");
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Exercise Library</h1>
          {isTherapist ? (
            <button onClick={handleCreateExercise} className="p-2">
              <Plus className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BC9BB]"
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {exerciseTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSelectedType(selectedType === type ? "All" : type)
                }
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? "bg-[#9BC9BB] text-gray-900"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-4 pt-4 space-y-4">
        {filteredExercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className="bg-[#F0EBE3] rounded-2xl p-4 cursor-pointer hover:bg-[#E8E3D8] transition-colors"
            onClick={() => {
              if (isTherapist) {
                navigate(`/therapist/exercise/${exercise.id}/edit`);
              } else {
                navigate(`/caregiver/exercise/${exercise.id}`);
              }
            }}
          >
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">{exercise.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {exercise.duration} • {exercise.time}
                </p>
                <div className="mb-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      typeColors[exercise.type]
                    }`}
                  >
                    {exercise.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {exercise.description}
                </p>
                
                {/* Caregiver Actions */}
                {!isTherapist && (
                  <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                    {!exerciseStates[exercise.id] && (
                      <button
                        onClick={() => handleStartExercise(exercise)}
                        className="px-8 py-2 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors whitespace-nowrap"
                      >
                        Start Exercise
                      </button>
                    )}
                    <button
                      onClick={() => toggleDone(exercise.id)}
                      className="flex items-center gap-2 text-sm cursor-pointer group whitespace-nowrap"
                    >
                      <motion.div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          exerciseStates[exercise.id]
                            ? "bg-[#4CAF50] border-[#4CAF50]"
                            : "border-gray-300 bg-white group-hover:border-[#4CAF50]"
                        }`}
                        animate={exerciseStates[exercise.id] ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {exerciseStates[exercise.id] && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3, ease: "backOut" }}
                          >
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.div>
                      <span className={`font-medium transition-colors ${
                        exerciseStates[exercise.id] ? "text-[#4CAF50]" : "text-gray-600 group-hover:text-[#4CAF50]"
                      }`}>
                        {exerciseStates[exercise.id] ? "Done" : "Mark as done"}
                      </span>
                    </button>
                  </div>
                )}

                {/* Therapist Actions */}
                {isTherapist && (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleAssignToPatient(exercise)}
                      className="w-full bg-[#9BC9BB] hover:bg-[#8AB9AA] transition-colors rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign to Patient
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditExercise(exercise)}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="flex-1 border-2 border-red-300 hover:border-red-400 text-red-600 transition-colors rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <ImageWithFallback
                src={exercise.imageUrl}
                alt={exercise.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-gray-500 text-center">
            No exercises found matching your search
          </p>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowAssignModal(false)}>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-white rounded-t-3xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Assign Exercise</h2>
              <button onClick={() => setShowAssignModal(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-[#F0EBE3] rounded-2xl">
              <h3 className="font-medium mb-1">{selectedExercise.name}</h3>
              <p className="text-sm text-gray-600">{selectedExercise.duration} • {selectedExercise.time}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3">Assignment Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-[#9BC9BB] bg-[#9BC9BB] rounded-2xl p-4 flex flex-col items-center gap-2">
                  <Repeat className="w-8 h-8" />
                  <span className="text-sm font-medium">Routine</span>
                  <span className="text-xs text-gray-600">Recurring schedule</span>
                </button>
                <button className="border-2 border-gray-300 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[#9BC9BB] transition-colors">
                  <CalendarDays className="w-8 h-8" />
                  <span className="text-sm font-medium">Single Time</span>
                  <span className="text-xs text-gray-600">One-time event</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3">Select Patient</h3>
              <div className="space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      toast.success(`Assigned "${selectedExercise.name}" to ${patient.name}`);
                      setShowAssignModal(false);
                    }}
                    className="w-full p-4 bg-[#F0EBE3] hover:bg-[#E5DED3] transition-colors rounded-2xl flex items-center justify-between"
                  >
                    <div className="text-left">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">Age {patient.age} • {patient.location}</p>
                    </div>
                    <UserPlus className="w-5 h-5 text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav userType={userType} />
    </div>
  );
}