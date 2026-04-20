import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { auth } from "../../lib/firebase";
import { 
  listenToTherapistAgenda, 
  listenToPatientSchedule, 
  getAllExercises,
  getPatientsByCaregiverEmail
} from "../../services/dbService";

interface CalendarProps {
  userType?: "therapist" | "caregiver";
}

interface ScheduledExercise {
  id: string;
  name: string;
  time: string;
  type: "Activate" | "Relaxing" | "Stimulant" | "Concentrate" | "Focus";
  completed: boolean;
  exerciseId: string;
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [scheduledExercises, setScheduledExercises] = useState<Record<number, ScheduledExercise[]>>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const allEx = await getAllExercises();
      
      const processAgenda = (agenda: any[]) => {
        const calendarMap: Record<number, ScheduledExercise[]> = {};
        
        agenda.forEach(a => {
          const ex = allEx.find(e => e.id === a.exerciseId);
          if (!ex) return;
          
          // Simplified: assume string 'date' exists or we show it on current day if 'repeats' is active.
          // For logic sync: We'll place it on the day parsed from date like "2024-05-25" or all days if repeats > 0.
          const dayMatch = a.date ? parseInt(a.date.split('-')[2]) : 15;
          const mapDay = (day: number) => {
            if (!calendarMap[day]) calendarMap[day] = [];
            calendarMap[day].push({
              id: a.id,
              exerciseId: a.exerciseId,
              name: ex.name,
              time: a.startTime,
              type: ex.type as any,
              completed: a.status === "Done"
            });
          };

          if(a.repeats && a.repeats.length > 0) {
            // For proof of concept, add to every day if repeating Daily
            if(a.repeats.includes("Daily")) {
              for(let i = 1; i <= 31; i++) mapDay(i);
            } else {
               // We just map it to day 15 visually if it repeats on weird days
               mapDay(15);
            }
          } else if (dayMatch) {
            mapDay(dayMatch);
          }
        });
        setScheduledExercises(calendarMap);
      };

      if (userType === "therapist") {
        listenToTherapistAgenda(user.uid, undefined, processAgenda);
      } else {
        const pts = await getPatientsByCaregiverEmail(user.email || "");
        if (pts.length > 0) {
          listenToPatientSchedule(pts[0].id, processAgenda);
        }
      }
    };
    fetchData();
  }, [userType, month, year]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-12"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const hasExercises = scheduledExercises[day];
    const isSelected = selectedDay === day;
    const isToday = day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();

    days.push(
      <button
        key={day}
        onClick={() => setSelectedDay(day)}
        className={`h-12 rounded-lg flex flex-col items-center justify-center text-sm relative ${
          isSelected
            ? "bg-[#9BC9BB] text-gray-900 font-medium"
            : isToday
            ? "border-2 border-[#9BC9BB]"
            : "hover:bg-gray-100"
        }`}
      >
        <span>{day}</span>
        {hasExercises && (
          <div className="flex gap-0.5 mt-1">
            {hasExercises.slice(0, 3).map((ex, idx) => (
              <div
                key={idx}
                className={`w-1 h-1 rounded-full ${typeColors[ex.type]}`}
              ></div>
            ))}
          </div>
        )}
      </button>
    );
  }

  const selectedExercises = selectedDay ? scheduledExercises[selectedDay] || [] : [];

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Calendar</h1>
          <div className="w-10" />
        </div>

        <div className="flex items-center justify-between">
          <button onClick={previousMonth} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-medium">
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">{days}</div>
        </div>

        {/* Scheduled Exercises */}
        {selectedExercises.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">
              Scheduled for {monthNames[month]} {selectedDay}
            </h3>
            {selectedExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-[#F0EBE3] rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${typeColors[exercise.type]}`}></div>
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-sm text-gray-600">{exercise.time}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/${userType === "therapist" ? "therapist" : "caregiver"}/exercise/${exercise.exerciseId}`)}
                  className="px-4 py-2 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedDay && selectedExercises.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No exercises scheduled for this day</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav userType={userType} />
    </div>
  );
}