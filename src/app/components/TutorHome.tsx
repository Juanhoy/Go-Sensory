import { useState } from "react";
import { useNavigate } from "react-router";
import { SlidersHorizontal, Bell, AlertTriangle, Check } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { motion } from "motion/react";

const exerciseImages = [
  "https://images.unsplash.com/photo-1633612605433-d2622726fa25?w=400",
  "https://images.unsplash.com/photo-1763218812866-a237afef2cc0?w=400",
  "https://images.unsplash.com/photo-1585850317821-89f2158747ef?w=400",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
];

const todayExercises = [
  {
    id: 1,
    name: "Jumping Jacks x 20",
    startTime: "2:30 p.m",
    duration: 15,
    type: "Relaxing",
    description:
      "This exercise will help the patient to activate his muscles and spend a bit of e...",
    image: exerciseImages[0],
    completed: false,
  },
  {
    id: 2,
    name: "Jumping Jacks x 20",
    startTime: "2:30 p.m",
    duration: 15,
    type: "Stimulate",
    description:
      "This exercise will help the patient to activate his muscles and spend a bit of e...",
    image: exerciseImages[1],
    completed: false,
  },
  {
    id: 3,
    name: "Jumping Jacks x 20",
    startTime: "2:30 p.m",
    duration: 15,
    type: "Concentrate",
    description:
      "This exercise will help the patient to activate his muscles and spend a bit of e...",
    image: exerciseImages[2],
    completed: false,
  },
  {
    id: 4,
    name: "Jumping Jacks x 20",
    startTime: "2:30 p.m",
    duration: 15,
    type: "Concentrate",
    description:
      "This exercise will help the patient to activate his muscles and spend a bit of e...",
    image: exerciseImages[3],
    completed: false,
  },
];

const moods = ["😊 Happy", "😌 Calm", "😟 Anxious", "😡 Frustrated", "😴 Tired"];

export function TutorHome() {
  const navigate = useNavigate();
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [exercises, setExercises] = useState(todayExercises);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Relaxing":
        return "bg-[#9BC9BB] text-white";
      case "Stimulate":
        return "bg-[#E88D67] text-white";
      case "Concentrate":
        return "bg-[#B695C0] text-white";
      default:
        return "bg-[#F9DC5C]";
    }
  };

  const handleStartExercise = (exerciseId: number) => {
    toast.success("Exercise started!");
    navigate("/caregiver/exercise-detail");
  };

  const handleMarkAsDone = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      )
    );
    toast.success("Exercise marked as complete!");
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodSelector(false);
    toast.success(`Mood recorded: ${mood}`);
  };

  const handleEmergencyExercise = () => {
    toast.info("Loading emergency exercise...");
    navigate("/caregiver/emergency");
  };

  return (
    <div className="min-h-screen pb-24 bg-[#F5F2ED]">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/img/gosensorylogo.png" 
            alt="Go Sensory" 
            className="h-10 w-auto object-contain cursor-pointer"
            onClick={() => navigate("/caregiver/home")}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Checking notifications...")}
            className="p-2 bg-[#9BC9BB] rounded-xl relative"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="px-4 mb-6">
        <button
          onClick={() => setShowMoodSelector(!showMoodSelector)}
          className="w-full bg-[#9BC9BB] rounded-2xl py-4 px-6 text-center"
        >
          {selectedMood || "Today, I've felt..."}
        </button>

        {showMoodSelector && (
          <div className="mt-2 bg-white rounded-2xl p-4 shadow-lg">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className="w-full text-left py-3 px-4 hover:bg-gray-100 rounded-lg"
              >
                {mood}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Today Exercises */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Today Exercises</h2>
          <button
            onClick={() => toast.info("Showing all exercises...")}
            className="text-sm underline"
          >
            See All
          </button>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-[#F0EBE3] rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-[#E8E3D8] transition-colors"
              onClick={() => navigate(`/caregiver/exercise/${exercise.id}`)}
            >
              <div className="flex-1 min-w-0">
                <h3 className="mb-2">{exercise.name}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Start Time: {exercise.startTime} &nbsp; Duration:{" "}
                  {exercise.duration} min
                </p>
                <div
                  className={`inline-block text-xs px-3 py-1 rounded-full mb-2 ${getTypeColor(
                    exercise.type
                  )}`}
                >
                  Exercise Type: {exercise.type}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {exercise.description}
                </p>
                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  {!exercise.completed && (
                    <button
                      onClick={() => handleStartExercise(exercise.id)}
                      className="px-8 py-2 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors whitespace-nowrap"
                    >
                      Start Exercise
                    </button>
                  )}
                  <button
                    onClick={() => handleMarkAsDone(exercise.id)}
                    className="flex items-center gap-2 cursor-pointer group whitespace-nowrap"
                  >
                    <motion.div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        exercise.completed
                          ? "bg-[#4CAF50] border-[#4CAF50]"
                          : "border-gray-300 bg-white group-hover:border-[#4CAF50]"
                      }`}
                      animate={exercise.completed ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {exercise.completed && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3, ease: "backOut" }}
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.div>
                    <span className={`text-sm font-medium transition-colors ${
                      exercise.completed ? "text-[#4CAF50]" : "text-gray-600 group-hover:text-[#4CAF50]"
                    }`}>
                      {exercise.completed ? "Done" : "Mark as done"}
                    </span>
                  </button>
                </div>
              </div>
              <ImageWithFallback
                src={exercise.image}
                alt={exercise.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Exercise Button */}
      <div className="px-4 mb-6">
        <button
          onClick={handleEmergencyExercise}
          className="w-full bg-[#5C5C8A] text-white rounded-2xl py-4 flex items-center justify-center gap-3"
        >
          <AlertTriangle className="w-6 h-6" />
          <span>Start an emergency exercise</span>
        </button>
      </div>

      <BottomNav userType="caregiver" />
    </div>
  );
}