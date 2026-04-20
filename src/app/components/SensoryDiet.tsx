import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Calendar, Check, Plus, UserPlus, Edit2, Trash2, X, Repeat } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { motion } from "motion/react";
import { auth } from "../../lib/firebase";
import { getPatientById, listenToTherapistAgenda, getAllExercises, deleteSchedule, updateSchedule } from "../../services/dbService";

const exerciseImages = [
  "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400",
  "https://images.unsplash.com/photo-1630571050152-49d673ccfe13?w=400",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=400",
];

export function SensoryDiet() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patient, setPatient] = useState<any>(null);
  const [dietExercises, setDietExercises] = useState<any[]>([]);
  const patientName = patient?.name || "Patient";

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user || !id) return;
      
      const pt = await getPatientById(id);
      setPatient(pt);
      
      const allEx = await getAllExercises();
      
      listenToTherapistAgenda(user.uid, id, (agenda) => {
        setDietExercises(agenda.map((a: any, idx: number) => ({
          ...a,
          exercise: allEx.find(e => e.id === a.exerciseId) || { name: 'Unknown', duration: 0, type: 'Unknown', description: '' },
          image: exerciseImages[idx % exerciseImages.length],
        })));
      });
    };
    fetchData();
  }, [id]);

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

  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("2024-05-25");
  const [endDate, setEndDate] = useState("2024-05-25");
  const [showRepeatModal, setShowRepeatModal] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [repeatTime, setRepeatTime] = useState("10:00");

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveRepeat = async () => {
    if (!showRepeatModal) return;
    try {
      await updateSchedule(showRepeatModal, { repeats: selectedDays });
      toast.success(`Repeat schedule updated: ${selectedDays.join(", ")}`);
      setShowRepeatModal(null);
    } catch(e) {
      toast.error("Failed to update schedule");
    }
  };

  const handleRemoveFromDiet = async (scheduleId: string) => {
    if(window.confirm("Are you sure you want to remove this exercise from the diet?")) {
      try {
        await deleteSchedule(scheduleId);
        toast.success("Exercise removed from diet");
      } catch(e) {
        toast.error("Failed to remove exercise");
      }
    }
  };

  return (
    <div className="min-h-screen pb-6 bg-[#F5F2ED]">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">{patientName}'s Diet</h1>
        <div className="w-10"></div>
      </div>

      {/* Action Buttons - Moved to top */}
      <div className="px-4 mt-6 mb-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate(`/therapist/patients/${id}/schedule`)}
          className="bg-[#9BC9BB] rounded-2xl py-6 flex flex-col items-center justify-center gap-2 hover:bg-[#8AB9AA] transition-colors"
        >
          <Plus className="w-8 h-8" />
          <span className="text-sm font-medium">Add Exercise</span>
        </button>
        <button
          className="bg-[#9BC9BB] rounded-2xl py-6 flex flex-col items-center justify-center gap-2 hover:bg-[#8AB9AA] transition-colors"
          onClick={() => toast.info("Calendar view coming soon!")}
        >
          <Calendar className="w-8 h-8" />
          <span className="text-sm font-medium">Calendar View</span>
        </button>
      </div>

      {/* Date Range with Date Pickers */}
      <div className="px-4 mb-6 flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#9BC9BB] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA89A] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:scale-125 [&::-webkit-calendar-picker-indicator]:brightness-0"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#9BC9BB] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA89A] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:scale-125 [&::-webkit-calendar-picker-indicator]:brightness-0"
            />
          </div>
        </div>
      </div>

      {/* Exercises Title */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-medium">Exercises</h2>
      </div>

      {/* Exercise List - Therapist style cards */}
      <div className="px-4 space-y-4 mb-6">
        {dietExercises.map((item) => (
          <div
            key={item.id}
            className="bg-[#F0EBE3] rounded-2xl p-4 cursor-pointer hover:bg-[#E8E3D8] transition-colors"
            onClick={() => navigate(`/therapist/exercise/${item.exercise.id}`)}
          >
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">{item.exercise.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.startTime} • {item.exercise.duration} min
                </p>
                <div className="mb-2">
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(
                      item.exercise.type
                    )}`}
                  >
                    {item.exercise.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.exercise.description}
                </p>

                {/* Therapist Actions */}
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setShowRepeatModal(item.id);
                      setSelectedDays(item.repeats || []);
                    }}
                    className="w-full bg-[#9BC9BB] hover:bg-[#8AB9AA] transition-colors rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Repeat className="w-4 h-4" />
                    Repeat On
                  </button>
                  <button
                    onClick={() => handleRemoveFromDiet(item.id)}
                    className="w-full border-2 border-red-300 hover:border-red-400 text-red-600 transition-colors rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove from Diet
                  </button>
                </div>
              </div>
              <ImageWithFallback
                src={item.image}
                alt={item.exercise.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Repeat Modal */}
      {showRepeatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Repeat Schedule</h3>
              <button onClick={() => setShowRepeatModal(null)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Days of the Week</label>
              <div className="flex gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                      selectedDays.includes(day) ? "bg-[#9BC9BB] text-white" : "bg-gray-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                value={repeatTime}
                onChange={(e) => setRepeatTime(e.target.value)}
                className="w-full bg-[#9BC9BB] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA89A]"
              />
            </div>
            <button
              onClick={handleSaveRepeat}
              className="w-full bg-[#9BC9BB] hover:bg-[#8AB9AA] transition-colors rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Repeat className="w-4 h-4" />
              Save Repeat Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}