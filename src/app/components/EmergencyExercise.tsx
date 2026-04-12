import { useNavigate } from "react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const emergencyExercises = [
  {
    id: 1,
    name: "Deep Breathing Exercise",
    duration: 5,
    description: "Calm down with slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.",
    image: "https://images.unsplash.com/photo-1630571050152-49d673ccfe13?w=400",
  },
  {
    id: 2,
    name: "Gentle Rocking",
    duration: 3,
    description: "Slow rocking motion back and forth to provide calming sensory input.",
    image: "https://images.unsplash.com/photo-1585850317821-89f2158747ef?w=400",
  },
  {
    id: 3,
    name: "Squeeze and Release",
    duration: 5,
    description: "Squeeze a stress ball or pillow tightly, then slowly release. Repeat several times.",
    image: "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
  },
];

export function EmergencyExercise() {
  const navigate = useNavigate();

  const handleStartEmergency = (exerciseId: number) => {
    toast.success("Starting emergency exercise...");
    navigate("/caregiver/exercise-detail");
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-6">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Emergency Exercises</h1>
        <div className="w-10" />
      </div>

      {/* Alert Banner */}
      <div className="px-4 mb-6">
        <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-red-800 mb-1">
              Quick Calming Exercises
            </h3>
            <p className="text-sm text-red-700">
              Use these exercises when your child needs immediate sensory regulation
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Exercise List */}
      <div className="px-4 space-y-4">
        {emergencyExercises.map((exercise) => (
          <div key={exercise.id} className="bg-[#F0EBE3] rounded-2xl p-4">
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <h3 className="text-lg mb-2">{exercise.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Duration: {exercise.duration} minutes
                </p>
                <p className="text-sm text-gray-700">{exercise.description}</p>
              </div>
              <ImageWithFallback
                src={exercise.image}
                alt={exercise.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            </div>
            <button
              onClick={() => handleStartEmergency(exercise.id)}
              className="w-full bg-[#5C5C8A] text-white rounded-2xl py-3 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Start Now</span>
            </button>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-medium mb-2">When to Use Emergency Exercises</h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>During meltdowns or sensory overload</li>
            <li>When child shows signs of extreme anxiety</li>
            <li>Before a potentially overwhelming situation</li>
            <li>As a quick reset between activities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
