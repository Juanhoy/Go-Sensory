import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Plus, MoreVertical } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNav } from "./BottomNav";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  age: number;
  avatar: string;
  parent: string;
  diagnosis: string;
  lastSession: string;
  progress: "excellent" | "good" | "needs-attention";
  upcomingExercises: number;
}

const patients: Patient[] = [
  {
    id: "1",
    name: "Alex Martinez",
    age: 7,
    avatar: "https://images.unsplash.com/photo-1669787210553-44e4f95106ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    parent: "Emily Rodriguez",
    diagnosis: "Autism Spectrum Disorder",
    lastSession: "2 days ago",
    progress: "excellent",
    upcomingExercises: 3,
  },
  {
    id: "2",
    name: "Sophia Chen",
    age: 6,
    avatar: "https://images.unsplash.com/photo-1754844362137-88441eb7cc6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    parent: "Michael Chen",
    diagnosis: "Sensory Processing Disorder",
    lastSession: "1 day ago",
    progress: "good",
    upcomingExercises: 5,
  },
  {
    id: "3",
    name: "Liam Johnson",
    age: 8,
    avatar: "https://images.unsplash.com/photo-1758273241260-f49172d876e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    parent: "Sarah Johnson",
    diagnosis: "ADHD",
    lastSession: "5 days ago",
    progress: "needs-attention",
    upcomingExercises: 2,
  },
  {
    id: "4",
    name: "Emma Davis",
    age: 5,
    avatar: "https://images.unsplash.com/photo-1754844362137-88441eb7cc6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    parent: "Jennifer Davis",
    diagnosis: "Autism Spectrum Disorder",
    lastSession: "3 days ago",
    progress: "good",
    upcomingExercises: 4,
  },
];

const progressColors = {
  excellent: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  "needs-attention": "bg-orange-100 text-orange-700",
};

const progressLabels = {
  excellent: "Excellent",
  good: "Good",
  "needs-attention": "Needs Attention",
};

export function PatientList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProgress, setFilterProgress] = useState<string | null>(null);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.parent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterProgress || patient.progress === filterProgress;
    return matchesSearch && matchesFilter;
  });

  const handleAddPatient = () => {
    toast.info("Add patient functionality coming soon!");
  };

  const handlePatientClick = (patientId: string) => {
    navigate(`/therapist/patients/${patientId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">My Patients</h1>
          <button onClick={handleAddPatient} className="p-2">
            <Plus className="w-6 h-6 text-[#9BC9BB]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BC9BB]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterProgress(null)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              !filterProgress
                ? "bg-[#9BC9BB] text-gray-900"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterProgress("excellent")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filterProgress === "excellent"
                ? "bg-[#9BC9BB] text-gray-900"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            Excellent
          </button>
          <button
            onClick={() => setFilterProgress("good")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filterProgress === "good"
                ? "bg-[#9BC9BB] text-gray-900"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            Good
          </button>
          <button
            onClick={() => setFilterProgress("needs-attention")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filterProgress === "needs-attention"
                ? "bg-[#9BC9BB] text-gray-900"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            Needs Attention
          </button>
        </div>
      </div>

      {/* Patient Stats */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            <p className="text-xs text-gray-500">Total Patients</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">
              {patients.filter((p) => p.progress === "excellent").length}
            </p>
            <p className="text-xs text-gray-500">Excellent</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {patients.filter((p) => p.progress === "needs-attention").length}
            </p>
            <p className="text-xs text-gray-500">Need Attention</p>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="px-4 space-y-3">
        {filteredPatients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => handlePatientClick(patient.id)}
            className="w-full bg-white rounded-xl p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <ImageWithFallback
                src={patient.avatar}
                alt={patient.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium truncate">{patient.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("More options coming soon!");
                    }}
                    className="p-1"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Age {patient.age} • Parent: {patient.parent}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      progressColors[patient.progress]
                    }`}
                  >
                    {progressLabels[patient.progress]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {patient.upcomingExercises} exercises scheduled
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Last session: {patient.lastSession}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-gray-500 text-center">No patients found</p>
        </div>
      )}

      <BottomNav userType="therapist" />
    </div>
  );
}