import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Play, Edit2 } from "lucide-react";
import { exercises } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const exerciseImages = [
  "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400",
  "https://images.unsplash.com/photo-1630571050152-49d673ccfe13?w=400",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=400",
];

export function TherapistExerciseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const exercise = exercises.find((ex) => ex.id === id);
  const exerciseImage = exerciseImages[exercises.findIndex((ex) => ex.id === id) % exerciseImages.length];

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Relaxing":
        return "bg-[#9BC9BB]";
      case "Stimulate":
        return "bg-[#E88D67]";
      case "Concentrate":
        return "bg-[#B695C0]";
      default:
        return "bg-[#F9DC5C]";
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#F5F2ED]">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Exercise Details</h1>
        <button 
          onClick={() => navigate(`/therapist/exercise/${id}/edit`)}
          className="p-2 text-[#9BC9BB] hover:text-[#7BA89A] transition-colors"
        >
          <Edit2 className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Video Player */}
        <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
          <ImageWithFallback
            src={exerciseImage}
            alt={exercise.name}
            className="w-full h-full object-cover opacity-60"
          />
          <button className="absolute inset-0 flex items-center justify-center group">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </button>
        </div>

        {/* Exercise Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-medium mb-2">{exercise.name}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
              <span>Duration: {exercise.duration} min</span>
              <span>•</span>
              <span>Intensity: {exercise.intensity}</span>
            </div>
            <div className={`inline-block text-sm px-4 py-1.5 rounded-full ${getTypeColor(exercise.type)}`}>
              {exercise.type}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h3 className="font-medium text-lg">Tutorial</h3>
            <p className="text-gray-700 leading-relaxed">{exercise.description}</p>
            
            <div className="space-y-3">
              <h4 className="font-medium">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Find a comfortable and quiet space to perform this exercise.</li>
                <li>Watch the video tutorial carefully before starting.</li>
                <li>Follow the demonstrated movements at your own pace.</li>
                <li>Take breaks if needed and stay hydrated.</li>
                <li>Complete the exercise for the recommended duration.</li>
              </ol>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <h4 className="font-medium">Benefits:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Helps improve sensory regulation</li>
                <li>Promotes better focus and attention</li>
                <li>Supports overall well-being</li>
              </ul>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate(`/therapist/exercise/${id}/edit`)}
            className="w-full bg-[#9BC9BB] text-gray-900 py-4 rounded-2xl font-medium hover:bg-[#7BA89A] transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Edit Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
