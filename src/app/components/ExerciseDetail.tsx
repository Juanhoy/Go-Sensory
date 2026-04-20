import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Play } from "lucide-react";
import { exercises } from "../data/mockData";
import { fallbackExercises } from "../data/fallbackExercises";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const exerciseImages = [
  "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400",
  "https://images.unsplash.com/photo-1630571050152-49d673ccfe13?w=400",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=400",
];

export function ExerciseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  let exercise = exercises.find((ex) => ex.id === id);
  let isFallback = false;

  if (!exercise) {
    const fallbackIndex = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackExercises.length : 0;
    exercise = fallbackExercises[fallbackIndex] as any;
    isFallback = true;
  }

  const exerciseImage = isFallback ? (exercise as any).steps[0]?.image : exerciseImages[Math.max(0, exercises.findIndex((ex) => ex.id === id)) % exerciseImages.length];

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
        <div className="w-10"></div>
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
            
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Step by Step:</h4>
              <div className="space-y-6">
                {(exercise as any).steps ? (exercise as any).steps.map((step: any, index: number) => (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#9BC9BB] flex items-center justify-center text-white font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step.instruction}</p>
                    </div>
                    <div className="rounded-xl overflow-hidden w-full h-48 bg-gray-100 ml-11" style={{ width: 'calc(100% - 2.75rem)' }}>
                      <ImageWithFallback src={step.image} alt={`Step ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )) : (
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Find a comfortable and quiet space to perform this exercise.</li>
                    <li>Watch the video tutorial carefully before starting.</li>
                    <li>Follow the demonstrated movements at your own pace.</li>
                    <li>Take breaks if needed and stay hydrated.</li>
                    <li>Complete the exercise for the recommended duration.</li>
                  </ol>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-lg">Benefits:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {((exercise as any).benefits || [
                  "Helps improve sensory regulation",
                  "Promotes better focus and attention",
                  "Supports overall well-being"
                ]).map((benefit: string, idx: number) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
