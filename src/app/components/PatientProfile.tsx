import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { patients, scheduledExercises, exercises } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

const exerciseImages = [
  "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400",
  "https://images.unsplash.com/photo-1630571050152-49d673ccfe13?w=400",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
];

export function PatientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const patient = patients.find((p) => p.id === id);
  const [activeFilter, setActiveFilter] = useState("Pending");

  if (!patient) return null;

  const filters = ["Pending", "Done", "Missed", "On Course"];

  const patientExercises = scheduledExercises
    .filter((se) => se.patientId === id)
    .map((se) => ({
      ...se,
      exercise: exercises.find((ex) => ex.id === se.exerciseId),
    }))
    .filter((item) => item.status === activeFilter);

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/therapist/patients")} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">{patient.name}</h1>
        <button className="p-2">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      {/* Patient Info Card */}
      <div className="px-4 mt-6 mb-6">
        <div className="bg-[#F0EBE3] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200"
                alt={patient.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full" />
              </div>
              <div className="mt-2 text-xs flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>{patient.status}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg mb-1">{patient.name}</h2>
              <p className="text-sm text-gray-600">{patient.age} years old</p>
              <p className="text-sm text-gray-600">{patient.dateOfBirth}</p>
              <p className="text-sm text-gray-600">Tutor: {patient.tutor}</p>
              <p className="text-sm text-gray-600">{patient.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensory Diet Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">Sensory Diet</h2>
          <button
            onClick={() => navigate(`/therapist/patients/${id}/diet`)}
            className="text-sm underline"
          >
            See Detail
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-[#9BC9BB]"
                  : "bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Exercise Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {patientExercises.map((item, idx) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden"
            >
              <ImageWithFallback
                src={exerciseImages[idx % exerciseImages.length]}
                alt={item.exercise?.name || "Exercise"}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm mb-2">{item.exercise?.name}</h3>
                <div
                  className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
                    item.status === "Pending" ? "bg-[#F9DC5C]" : "bg-gray-200"
                  }`}
                >
                  {item.status}
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Repeats: {item.repeats.join(", ")}
                </p>
                <p className="text-xs text-gray-600">{item.startTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 space-y-3">
        <button
          onClick={() => navigate(`/therapist/patients/${id}/diet`)}
          className="w-full border-2 border-gray-900 rounded-2xl py-4"
        >
          Edit Diet
        </button>
        <button
          onClick={() => {
            toast.success("Opening chat with tutor...");
          }}
          className="w-full bg-[#9BC9BB] rounded-2xl py-4"
        >
          Contact tutor
        </button>
      </div>
    </div>
  );
}