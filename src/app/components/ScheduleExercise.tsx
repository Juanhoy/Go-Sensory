import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import { exercises, patients } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

export function ScheduleExercise() {
  const navigate = useNavigate();
  const { patientId, exerciseId } = useParams();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("PM");
  const [alertsOn, setAlertsOn] = useState(true);

  const patient = patients.find((p) => p.id === patientId);
  const exercise = exercises.find((e) => e.id === exerciseId) || exercises[1];

  const handleSchedule = () => {
    toast.success("Exercise scheduled successfully!");
    navigate(`/therapist/patients/${patientId}`);
  };

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Schedule Exercise</h1>
        <button className="p-2">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Patient Name */}
        <div className="bg-[#F0EBE3] rounded-2xl px-6 py-4">
          <p className="text-center">Patient: {patient?.name || "Julian Benitez"}</p>
        </div>

        {/* Exercise Card */}
        <div className="bg-[#F0EBE3] rounded-2xl p-4 flex gap-3">
          <div className="flex-1">
            <h3 className="mb-2">{exercise.name}</h3>
            <div className="inline-block bg-[#E88D67] text-white text-xs px-3 py-1 rounded-full mb-2">
              Exercise Type: {exercise.type}
            </div>
            <p className="text-sm text-gray-600">{exercise.description}</p>
          </div>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400"
            alt={exercise.name}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
        </div>

        {/* Date and Time */}
        <div className="flex items-center justify-between">
          <p>Tue., july 16 2024</p>
          <button
            onClick={() => setShowTimePicker(true)}
            className="px-4 py-2 bg-[#E8E4DB] rounded-lg"
          >
            9:30 p.m
          </button>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between">
          <p>Duration:</p>
          <p>{exercise.duration} mins</p>
        </div>

        {/* Repeats */}
        <div>
          <p className="mb-2">
            Repeats: weekly on mon., thu., wed., thu., fri., sat., sun.
          </p>
        </div>

        {/* Alerts Toggle */}
        <div className="flex items-center justify-between">
          <p>Alerts: On</p>
          <button
            onClick={() => setAlertsOn(!alertsOn)}
            className={`w-14 h-8 rounded-full transition-colors ${
              alertsOn ? "bg-[#9BC9BB]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                alertsOn ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Schedule Button */}
        <button
          onClick={handleSchedule}
          className="w-full bg-[#9BC9BB] rounded-2xl py-4 mt-8"
        >
          Schedule Exercise
        </button>
      </div>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg">Start time</h2>
              <button onClick={() => setShowTimePicker(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Time Picker Wheels */}
            <div className="flex items-center justify-center gap-4 mb-6 bg-[#F0EBE3] rounded-2xl py-8">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() =>
                    setSelectedHour(selectedHour === 12 ? 1 : selectedHour + 1)
                  }
                  className="text-gray-400 text-sm"
                >
                  {selectedHour === 12 ? 1 : selectedHour + 1}
                </button>
                <div className="text-2xl my-2">{selectedHour}</div>
                <button
                  onClick={() =>
                    setSelectedHour(selectedHour === 1 ? 12 : selectedHour - 1)
                  }
                  className="text-gray-400 text-sm"
                >
                  {selectedHour === 1 ? 12 : selectedHour - 1}
                </button>
              </div>

              <span className="text-2xl">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() =>
                    setSelectedMinute(selectedMinute === 59 ? 0 : selectedMinute + 1)
                  }
                  className="text-gray-400 text-sm"
                >
                  {String(selectedMinute === 59 ? 0 : selectedMinute + 1).padStart(
                    2,
                    "0"
                  )}
                </button>
                <div className="text-2xl my-2">
                  {String(selectedMinute).padStart(2, "0")}
                </div>
                <button
                  onClick={() =>
                    setSelectedMinute(selectedMinute === 0 ? 59 : selectedMinute - 1)
                  }
                  className="text-gray-400 text-sm"
                >
                  {String(selectedMinute === 0 ? 59 : selectedMinute - 1).padStart(
                    2,
                    "0"
                  )}
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedPeriod("AM")}
                  className={selectedPeriod === "AM" ? "" : "text-gray-400 text-sm"}
                >
                  AM
                </button>
                <div className="text-2xl my-2">{selectedPeriod}</div>
                <button
                  onClick={() => setSelectedPeriod("PM")}
                  className={selectedPeriod === "PM" ? "" : "text-gray-400 text-sm"}
                >
                  PM
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowTimePicker(false)}
              className="w-full bg-[#9BC9BB] rounded-2xl py-3"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}