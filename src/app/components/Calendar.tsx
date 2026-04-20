import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, User, Edit2, Trash2, X, Calendar as CalendarIcon } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { fallbackExercises } from "../data/fallbackExercises";
import { 
  listenToTherapistAgenda, 
  listenToPatientSchedule, 
  getAllExercises,
  getPatientsByCaregiverEmail,
  getPatientsByTherapist,
  scheduleExercise,
  updateSchedule,
  deleteSchedule
} from "../../services/dbService";
import { isExerciseActiveOnDate } from "../utils/scheduleUtils";
import { ScheduleExerciseForm } from "./ScheduleExerciseForm";

interface CalendarProps {
  userType?: "therapist" | "caregiver";
}

interface ScheduledExercise {
  id: string;
  name: string;
  time: string;
  date: string;
  type: "Activate" | "Relaxing" | "Stimulant" | "Concentrate" | "Focus";
  completed: boolean;
  exerciseId: string;
  patientId?: string;
  patientName?: string;
  repeats?: string[];
}

const typeColors: Record<string, string> = {
  Activate: "bg-[#E57373]",
  Relaxing: "bg-[#9BC9BB]",
  Stimulant: "bg-[#B39DDB]",
  Concentrate: "bg-[#90A4AE]",
  Focus: "bg-[#FFB74D]",
};

export function Calendar({ userType }: CalendarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPatientId = location.state?.patientId || "all";
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [scheduledExercises, setScheduledExercises] = useState<Record<number, ScheduledExercise[]>>({});
  
  // New States
  const [viewMode, setViewMode] = useState<"Month" | "Week" | "Day">("Month");
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId);
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [exercisesData, setExercisesData] = useState<any[]>([]);
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalData, setModalData] = useState<any>({});

  const isTherapist = userType === "therapist";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    let unsubscribe: any;
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const allEx = await getAllExercises();
      setExercisesData(allEx);
      
      let therapistPatients: any[] = [];
      if (isTherapist) {
        therapistPatients = await getPatientsByTherapist(user.uid);
        setPatientsList(therapistPatients);
      }

      const processAgenda = (agenda: any[]) => {
        const calendarMap: Record<number, ScheduledExercise[]> = {};
        
        // We need to check every day of the current month
        for (let d = 1; d <= daysInMonth; d++) {
          const checkDate = new Date(year, month, d);
          
          agenda.forEach(a => {
            const ex = allEx.find(e => e.id === a.exerciseId) || fallbackExercises.find(e => e.id === a.exerciseId);
            if (!ex) return;

            if (isExerciseActiveOnDate(a, checkDate)) {
               const patientObj = therapistPatients.find(p => p.id === a.patientId);
               if (!calendarMap[d]) calendarMap[d] = [];
               
               calendarMap[d].push({
                 id: a.id,
                 exerciseId: a.exerciseId,
                 name: ex.name,
                 time: a.startTime || "09:00",
                 date: a.date,
                 type: ex.type as any,
                 completed: a.status === "Done",
                 patientId: a.patientId,
                 patientName: patientObj ? patientObj.name : undefined,
                 repeats: a.repeats
               });
            }
          });
        }
        setScheduledExercises(calendarMap);
      };

      if (isTherapist) {
        unsubscribe = listenToTherapistAgenda(user.uid, undefined, processAgenda);
      } else {
        const pts = await getPatientsByCaregiverEmail(user.email || "");
        if (pts.length > 0) {
          unsubscribe = listenToPatientSchedule(pts[0].id, processAgenda);
        }
      }
    };
    fetchData();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [userType, month, year, isTherapist]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Navigation
  const previousPeriod = () => {
    if (viewMode === "Month") setCurrentDate(new Date(year, month - 1, 1));
    else if (viewMode === "Week") setCurrentDate(new Date(year, month, currentDate.getDate() - 7));
    else setCurrentDate(new Date(year, month, currentDate.getDate() - 1));
  };
  const nextPeriod = () => {
    if (viewMode === "Month") setCurrentDate(new Date(year, month + 1, 1));
    else if (viewMode === "Week") setCurrentDate(new Date(year, month, currentDate.getDate() + 7));
    else setCurrentDate(new Date(year, month, currentDate.getDate() + 1));
  };

  const getFilteredExercises = useCallback((day: number) => {
    let exercises = scheduledExercises[day] || [];
    if (isTherapist && selectedPatientId !== "all") {
      exercises = exercises.filter(ex => ex.patientId === selectedPatientId);
    }
    // Sort by time
    exercises.sort((a,b) => a.time.localeCompare(b.time));
    return exercises;
  }, [scheduledExercises, selectedPatientId, isTherapist]);

  const openAddModal = () => {
    setEditMode(false);
    setModalData({
      patientId: patientsList.length > 0 ? patientsList[0].id : "",
      exerciseId: exercisesData.length > 0 ? exercisesData[0].id : fallbackExercises[0].id,
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`,
      startTime: "09:00",
      repeat: "None",
      repeats: []
    });
    setShowModal(true);
  };

  const openEditModal = (ex: ScheduledExercise) => {
    setEditMode(true);
    setModalData({
      id: ex.id,
      patientId: ex.patientId || "",
      exerciseId: ex.exerciseId,
      date: ex.date || `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`,
      startTime: ex.time,
      repeat: (ex.repeats && ex.repeats.length > 0) ? "Daily" : "None"
    });
    setShowModal(true);
  };

  const saveModalData = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    try {
      const payload = {
        therapistId: user.uid,
        patientId: modalData.patientId,
        exerciseId: modalData.exerciseId,
        date: modalData.date,
        startTime: modalData.startTime,
        repeats: modalData.repeat === "Daily" ? ["Daily"] : [],
        status: "Pending" as any
      };
      if (editMode && modalData.id) {
        await updateSchedule(modalData.id, payload);
        toast.success("Schedule updated!");
      } else {
        await scheduleExercise(payload);
        toast.success("Exercise scheduled!");
      }
      setShowModal(false);
    } catch(err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this scheduled exercise?")) {
      try {
        await deleteSchedule(id);
        toast.success("Deleted successfully");
        setShowModal(false);
      } catch(e) {
        toast.error("Failed to delete");
      }
    }
  };

  const renderAgendaList = (dayFilter: number) => {
    const list = getFilteredExercises(dayFilter);
    if (list.length === 0) return <p className="text-gray-500 text-center py-4">No exercises scheduled.</p>;
    
    return list.map((exercise) => (
      <div key={exercise.id} className="bg-[#F0EBE3] rounded-xl p-4 flex items-center justify-between mb-3 shadow-[0px_2px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 mt-1.5 rounded-full ${typeColors[exercise.type] || "bg-gray-400"}`}></div>
          <div>
            <h4 className="font-medium text-gray-900 leading-tight">{exercise.name}</h4>
            <div className="text-sm text-gray-600 mt-0.5 flex flex-col">
              <span>{exercise.time}</span>
              {isTherapist && exercise.patientName && (
                <span className="text-[#9BC9BB] font-medium">{exercise.patientName}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isTherapist && (
            <button onClick={() => openEditModal(exercise)} className="p-2 border-2 border-gray-300 rounded-xl hover:border-gray-900 transition-colors">
              <Edit2 className="w-4 h-4 text-gray-700 hover:text-gray-900" />
            </button>
          )}
          <button 
            onClick={() => navigate(`/${userType === "therapist" ? "therapist" : "caregiver"}/exercise/${exercise.exerciseId}`)}
            className="px-4 py-2 bg-gray-900 border-2 border-gray-900 rounded-xl text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Calendar</h1>
          {isTherapist ? (
            <button onClick={openAddModal} className="p-2 -mr-2 text-[#9BC9BB]">
              <Plus className="w-6 h-6" />
            </button>
          ) : <div className="w-10"></div>}
        </div>

        {/* Filters Top Bar */}
        {isTherapist && (
          <div className="flex gap-2 mb-4">
            <div className="flex flex-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
              {["Month", "Week", "Day"].map(mode => (
                <button 
                  key={mode} 
                  onClick={() => setViewMode(mode as any)} 
                  className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${viewMode === mode ? 'bg-[#9BC9BB] text-black font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <select 
              value={selectedPatientId} 
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-white rounded-xl px-3 py-1.5 text-sm border border-gray-100 shadow-sm outline-none w-32"
            >
              <option value="all">All Patients</option>
              {patientsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-sm">
          <button onClick={previousPeriod} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-base font-medium">
            {viewMode === "Day" 
              ? `${monthNames[month]} ${currentDate.getDate()}, ${year}`
              : `${monthNames[month]} ${year}`}
          </h2>
          <button onClick={nextPeriod} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4">
        {/* Month View Grid */}
        {viewMode === "Month" && (
          <div className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-50">
            <div className="grid grid-cols-7 gap-y-3 gap-x-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-center text-[11px] text-gray-400 font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
              {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} className="h-10"></div>)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const filteredEx = getFilteredExercises(day);
                const isSelected = selectedDay === day;
                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-10 rounded-full flex flex-col items-center justify-center text-sm relative transition-colors ${
                      isSelected ? "bg-gray-900 text-white font-medium shadow-md" : 
                      isToday ? "border-2 border-[#9BC9BB] text-gray-900 font-medium" : 
                      "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{day}</span>
                    {filteredEx.length > 0 && (
                      <div className="flex gap-[2px] mt-0.5">
                        {filteredEx.slice(0,3).map((ex, idx) => (
                           <div key={idx} className={`w-1 h-1 rounded-full ${typeColors[ex.type] || "bg-gray-400"}`}></div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Week View */}
        {viewMode === "Week" && (() => {
          const startOfWeek = new Date(year, month, currentDate.getDate() - currentDate.getDay());
          return (
            <div className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-50 overflow-x-auto">
               <div className="flex gap-4 min-w-max justify-between">
                 {[...Array(7)].map((_, i) => {
                   const d = new Date(startOfWeek);
                   d.setDate(d.getDate() + i);
                   const dayNum = d.getDate();
                   const isActive = selectedDay === dayNum;
                   const isActualToday = d.getDate() === new Date().getDate() && d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
                   
                   return (
                     <button 
                        key={i} 
                        onClick={() => {
                          if (d.getMonth() !== month) setCurrentDate(d);
                          setSelectedDay(dayNum);
                        }}
                        className={`flex flex-col items-center w-[46px] py-3 rounded-2xl transition-all ${
                          isActive ? 'bg-gray-900 text-white shadow-md' : 
                          isActualToday ? 'border-2 border-[#9BC9BB] text-gray-900 bg-white' :
                          'hover:bg-gray-50 bg-[#F5F2ED] text-gray-700'
                        }`}
                     >
                        <span className="text-xs mb-1 opacity-70">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]}</span>
                        <span className="text-lg font-medium">{dayNum}</span>
                        {getFilteredExercises(dayNum).length > 0 && <div className={`w-1 h-1 rounded-full mt-2 ${isActive ? 'bg-white' : 'bg-[#E57373]'}`}></div>}
                     </button>
                   );
                 })}
               </div>
            </div>
          );
        })()}

        {/* Agendas below Grid (Only for Month & Week) */}
        {viewMode !== "Day" && (
          <div>
            <div className="flex items-center justify-between mb-4 mt-2 px-1">
               <h3 className="font-medium text-gray-900">
                 Agenda — {monthNames[month]} {selectedDay}
               </h3>
            </div>
            {renderAgendaList(selectedDay)}
          </div>
        )}

        {/* Day View Vertical Timeline */}
        {viewMode === "Day" && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-[80px]">
             <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                 <CalendarIcon className="w-5 h-5 text-[#9BC9BB]" />
                 <h3 className="font-medium">Schedule for Today</h3>
             </div>
             <div className="space-y-4">
                 {renderAgendaList(currentDate.getDate())}
             </div>
          </div>
        )}
      </div>

      {/* FAB Add Button */}
      {isTherapist && (
        <button
          onClick={openAddModal}
          className="fixed bottom-[104px] right-6 w-14 h-14 bg-[#9BC9BB] rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(155,201,187,0.4)] hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6 text-gray-900" />
        </button>
      )}

      <BottomNav userType={userType} />

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-0 backdrop-blur-sm" onClick={() => setShowModal(false)}>
           <div 
             className="bg-white w-full max-w-md rounded-t-3xl p-6 overflow-y-auto max-h-[90vh] pb-[80px] sm:pb-6 shadow-2xl" 
             onClick={e => e.stopPropagation()}
             style={{ animation: 'slideUp 0.3s ease-out' }}
           >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">{editMode ? "Edit Schedule" : "Add to Calendar"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-600"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="mt-2">
                <ScheduleExerciseForm 
                  isModal={true}
                  editMode={editMode}
                  scheduleId={modalData.id}
                  initialData={modalData}
                  onSuccess={() => setShowModal(false)}
                  onCancel={() => setShowModal(false)}
                />
              </div>
           </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}