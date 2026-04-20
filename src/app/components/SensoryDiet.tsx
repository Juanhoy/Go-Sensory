import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Calendar, Check, Plus, UserPlus, Edit2, Trash2, X, Repeat, CalendarDays } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { motion } from "motion/react";
import { auth } from "../../lib/firebase";
import { getPatientById, listenToTherapistAgenda, getAllExercises, deleteSchedule, updateSchedule } from "../../services/dbService";
import { fallbackExercises } from "../data/fallbackExercises";

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
      
      const dbEx = await getAllExercises();
      const allEx = [...dbEx, ...fallbackExercises];
      
      listenToTherapistAgenda(user.uid, id, (agenda) => {
        setDietExercises(agenda.map((a: any) => {
          const exDetail = allEx.find(e => e.id === a.exerciseId);
          return {
            ...a,
            exercise: exDetail || { name: 'Unknown', duration: 0, type: 'Unknown', description: '' },
            image: exDetail?.imageUrl || exDetail?.steps?.[0]?.image || "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400",
          };
        }));
      });
    };
    fetchData();
  }, [id]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Relaxing":
        return "bg-[#9BC9BB]";
      case "Stimulate":
      case "Activate":
        return "bg-[#E88D67]";
      case "Concentrate":
      case "Focus":
        return "bg-[#B695C0]";
      default:
        return "bg-[#F9DC5C]";
    }
  };

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
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
      await updateSchedule(showRepeatModal, { 
        repeats: selectedDays,
        startTime: repeatTime
      });
      toast.success(`Repeat schedule updated: ${selectedDays.join(", ")} at ${repeatTime}`);
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

      {/* Action Buttons */}
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
          onClick={() => navigate("/therapist/calendar", { state: { patientId: id } })}
        >
          <Calendar className="w-8 h-8" />
          <span className="text-sm font-medium">Calendar View</span>
        </button>
      </div>

      {/* Date Range with Date Pickers */}
      <div className="px-4 mb-6 flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">Diet Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#9BC9BB] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA89A]"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">Diet End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#9BC9BB] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA89A]"
            />
          </div>
        </div>
      </div>

      {/* Exercises Title */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-medium">Exercises in Diet</h2>
      </div>

      {/* Exercise List */}
      <div className="px-4 space-y-4 mb-6">
        {dietExercises.map((item) => (
          <div
            key={item.id}
            className="bg-[#F0EBE3] rounded-3xl p-5 cursor-pointer hover:bg-[#E8E3D8] transition-colors shadow-sm"
            onClick={() => navigate(`/therapist/exercise/${item.exercise.id}`)}
          >
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block text-[11px] px-3 py-1 rounded-full font-bold text-white uppercase tracking-wider ${getTypeColor(
                      item.exercise.type
                    )}`}
                  >
                    {item.exercise.type}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{item.exercise.duration || item.exercise.time}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{item.exercise.name}</h3>
                <p className="text-sm font-medium text-[#9BC9BB] mb-3">{item.startTime}</p>
                
                <div className="space-y-2 mb-4 text-[13px] text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span>Duration: {item.date} {item.endDate && item.endDate !== item.date ? `to ${item.endDate}` : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-gray-400" />
                    <span>Repeats: {item.repeats && item.repeats.length > 0 ? (item.repeats.includes("Daily") ? "Every Day" : item.repeats.join(", ")) : "Once"}</span>
                  </div>
                </div>

                {/* Therapist Actions */}
                <div className="grid grid-cols-1 gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setShowRepeatModal(item.id);
                      setSelectedDays(item.repeats || []);
                    }}
                    className="w-full bg-[#9BC9BB] text-gray-900 hover:bg-[#8AB9AA] transition-colors rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Repeat className="w-4 h-4" />
                    Repeat On
                  </button>
                  <button
                    onClick={() => handleRemoveFromDiet(item.id)}
                    className="w-full border-2 border-red-200 text-red-500 hover:border-red-500 hover:bg-red-50 transition-all rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove from Diet
                  </button>
                </div>
              </div>
              <ImageWithFallback
                src={item.image}
                alt={item.exercise.name}
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border-2 border-white shadow-sm"
              />
            </div>
          </div>
        ))}

        {dietExercises.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No exercises assigned to this diet yet.</p>
          </div>
        )}
      </div>

      {/* Repeat Modal */}
      {showRepeatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Repeat Schedule</h3>
              <button onClick={() => setShowRepeatModal(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3 text-gray-700">Days of the Week</label>
              <div className="grid grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                      selectedDays.includes(day) 
                        ? "bg-gray-900 text-white shadow-lg scale-105" 
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold mb-3 text-gray-700">Time</label>
              <input
                type="time"
                value={repeatTime}
                onChange={(e) => setRepeatTime(e.target.value)}
                className="w-full bg-gray-100 rounded-2xl px-6 py-4 text-lg font-bold focus:bg-white focus:ring-2 focus:ring-[#9BC9BB] outline-none transition-all"
              />
            </div>
            
            <button
              onClick={handleSaveRepeat}
              className="w-full bg-[#9BC9BB] text-gray-900 hover:bg-[#8AB9AA] transition-colors rounded-2xl py-4 font-bold shadow-lg"
            >
              Update Diet Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}