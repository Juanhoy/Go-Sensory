import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Upload, Video, Save } from "lucide-react";
import { exercises, patients } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

const exerciseImages = [
  "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400",
  "https://images.unsplash.com/photo-1630571050152-49d673ccfe13?w=400",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=400",
];

export function EditExercise() {
  const navigate = useNavigate();
  const { id } = useParams();

  const exercise = exercises.find((ex) => ex.id === id);
  const exerciseImage = exerciseImages[exercises.findIndex((ex) => ex.id === id) % exerciseImages.length];

  const [formData, setFormData] = useState({
    name: exercise?.name || "",
    type: exercise?.type || "Relaxing",
    duration: exercise?.duration || 15,
    intensity: exercise?.intensity || "Low",
    description: exercise?.description || "",
    instructions: [
      "Find a comfortable and quiet space to perform this exercise.",
      "Watch the video tutorial carefully before starting.",
      "Follow the demonstrated movements at your own pace.",
      "Take breaks if needed and stay hydrated.",
      "Complete the exercise for the recommended duration.",
    ],
    benefits: [
      "Helps improve sensory regulation",
      "Promotes better focus and attention",
      "Supports overall well-being",
    ],
  });

  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const handleSave = () => {
    toast.success("Exercise updated successfully!");
    navigate(-1);
  };

  const togglePatientSelection = (patientId: string) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  return (
    <div className="min-h-screen pb-24 bg-[#F5F2ED]">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Edit Exercise</h1>
        <button
          onClick={handleSave}
          className="p-2 text-[#9BC9BB] hover:text-[#7BA89A] transition-colors"
        >
          <Save className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Exercise Video</label>
          <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={exerciseImage}
              alt={exercise.name}
              className="w-full h-full object-cover opacity-60"
            />
            <button className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 hover:bg-black/50 transition-colors">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-900" />
              </div>
              <span className="text-white text-sm font-medium">Upload New Video</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h3 className="font-medium text-lg">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Exercise Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9BC9BB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9BC9BB] bg-white"
              >
                <option>Relaxing</option>
                <option>Stimulate</option>
                <option>Concentrate</option>
                <option>Movement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9BC9BB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Intensity</label>
            <select
              value={formData.intensity}
              onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9BC9BB] bg-white"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9BC9BB] resize-none"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h3 className="font-medium text-lg">Instructions</h3>
          {formData.instructions.map((instruction, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-2">Step {index + 1}</label>
              <textarea
                value={instruction}
                onChange={(e) => {
                  const newInstructions = [...formData.instructions];
                  newInstructions[index] = e.target.value;
                  setFormData({ ...formData, instructions: newInstructions });
                }}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9BC9BB] resize-none"
              />
            </div>
          ))}
        </div>

        {/* Assign to Patients */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h3 className="font-medium text-lg">Assign to Patients</h3>
          <div className="space-y-3">
            {patients.map((patient) => (
              <label
                key={patient.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedPatients.includes(patient.id)}
                  onChange={() => togglePatientSelection(patient.id)}
                  className="w-5 h-5 rounded border-gray-300 text-[#9BC9BB] focus:ring-[#9BC9BB]"
                />
                <div className="flex-1">
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-sm text-gray-500">Age: {patient.age}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-[#9BC9BB] text-gray-900 py-4 rounded-2xl font-medium hover:bg-[#7BA89A] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
