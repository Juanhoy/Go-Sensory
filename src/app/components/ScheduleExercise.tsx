import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MoreVertical, X, Calendar as CalendarIcon, Clock, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { getPatientById, getAllExercises, scheduleExercise } from "../../services/dbService";
import { fallbackExercises } from "../data/fallbackExercises";

export function ScheduleExercise() {
  const navigate = useNavigate();
  const { patientId, exerciseId: initialExerciseId } = useParams();
  
  const [patient, setPatient] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(initialExerciseId || "");
  const [loading, setLoading] = useState(true);

  // Form State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [repeats, setRepeats] = useState<string[]>([]);
  const [alertsOn, setAlertsOn] = useState(true);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (patientId) {
          const pt = await getPatientById(patientId);
          setPatient(pt);
        }
        
        const dbEx = await getAllExercises();
        const combined = [...dbEx, ...fallbackExercises];
        setExercises(combined);
        
        if (!selectedExerciseId && combined.length > 0) {
          setSelectedExerciseId(combined[0].id);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    auth.onAuthStateChanged((user) => {
      if (user) fetchData();
    });
  }, [patientId]);

  const selectedExercise = exercises.find(e => e.id === selectedExerciseId);

  const toggleDay = (day: string) => {
    setRepeats(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSchedule = async () => {
    const user = auth.currentUser;
    if (!user || !patientId || !selectedExerciseId) return;

    try {
      await scheduleExercise({
        exerciseId: selectedExerciseId,
        patientId: patientId,
        therapistId: user.uid,
        startTime,
        date: startDate,
        endDate, // We could store this as well if needed in DB
        repeats,
        status: "Pending"
      } as any);

      toast.success("Exercise scheduled successfully!");
      navigate(`/therapist/patients/${patientId}/diet`);
    } catch (e) {
      toast.error("Failed to schedule exercise");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading schedule...</div>;

  return (
    <div className="min-h-screen pb-24 bg-[#F5F2ED]">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Schedule Exercise</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Patient Name Section */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Patient</p>
            <h2 className="text-base font-semibold text-gray-900">{patient?.name || "Unknown Patient"}</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#9BC9BB] flex items-center justify-center text-white font-bold">
            {patient?.name?.charAt(0) || "P"}
          </div>
        </div>

        {/* Exercise Selection */}
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Select Exercise</label>
            <select 
                value={selectedExerciseId} 
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full bg-white rounded-2xl px-4 py-4 outline-none border border-gray-100 shadow-sm appearance-none cursor-pointer font-medium"
            >
                {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.type})</option>
                ))}
            </select>
        </div>

        {/* Preview Selected Exercise */}
        {selectedExercise && (
          <div className="bg-[#F0EBE3] rounded-3xl p-4 flex gap-4 shadow-inner">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-2">
                 <span className="bg-[#E88D67] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                   {selectedExercise.type}
                 </span>
                 <span className="text-xs text-gray-500 font-medium">{selectedExercise.duration || selectedExercise.time}</span>
               </div>
               <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                 {selectedExercise.description}
               </p>
            </div>
            <ImageWithFallback
              src={selectedExercise.imageUrl || selectedExercise.steps?.[0]?.image || "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400"}
              alt={selectedExercise.name}
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border-2 border-white shadow-sm"
            />
          </div>
        )}

        {/* Date Pickers */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-700">Start Date</label>
             <div className="relative">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-[#9BC9BB] transition-all"
                />
             </div>
           </div>
           <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-700">End Date</label>
             <div className="relative">
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white rounded-2xl px-4 py-3.5 text-sm border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-[#9BC9BB] transition-all"
                />
             </div>
           </div>
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
           <label className="block text-sm font-medium text-gray-700">Start Time</label>
           <div className="relative">
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white rounded-2xl px-8 py-3.5 text-base font-semibold text-center border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-[#9BC9BB] transition-all"
              />
           </div>
        </div>

        {/* Repeats */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Repeats On</label>
          <div className="flex justify-between gap-1 overflow-x-auto pb-1">
             {daysOfWeek.map(day => {
               const active = repeats.includes(day);
               return (
                 <button 
                   key={day} 
                   onClick={() => toggleDay(day)}
                   className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${active ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                 >
                   {day}
                 </button>
               );
             })}
          </div>
        </div>

        {/* Alerts Toggle */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl ${alertsOn ? 'bg-[#E8F5F1]' : 'bg-gray-100'} transition-colors`}>
                <Clock className={`w-5 h-5 ${alertsOn ? 'text-[#9BC9BB]' : 'text-gray-400'}`} />
             </div>
             <span className="font-medium text-gray-900">Notifications On</span>
          </div>
          <button
            onClick={() => setAlertsOn(!alertsOn)}
            className={`w-12 h-6 rounded-full transition-all relative ${alertsOn ? "bg-[#9BC9BB]" : "bg-gray-200"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${alertsOn ? "right-1" : "left-1"}`} />
          </button>
        </div>

        {/* Schedule Button */}
        <button
          onClick={handleSchedule}
          className="w-full bg-gray-900 text-white rounded-2xl py-5 font-semibold text-lg shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 transition-colors mt-4"
        >
          Assign to sensory diet
        </button>
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0.5);
        }
      `}</style>
    </div>
  );
}