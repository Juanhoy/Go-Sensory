import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ScheduleExerciseForm } from "./ScheduleExerciseForm";

export function ScheduleExercise() {
  const navigate = useNavigate();
  const { patientId, exerciseId } = useParams();

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

      <div className="px-4 mt-6">
        <ScheduleExerciseForm 
            patientId={patientId === 'all' ? undefined : patientId}
            exerciseId={exerciseId}
            onSuccess={() => navigate(`/therapist/patients/${patientId === 'all' ? '' : patientId}/diet`)}
            onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}