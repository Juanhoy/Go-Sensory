import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Plus, MoreVertical, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNav } from "./BottomNav";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { getPatientsByTherapist, addPatient } from "../../services/dbService";

const progressColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  "needs-attention": "bg-orange-100 text-orange-700",
};

const progressLabels: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  "needs-attention": "Needs Attention",
};

const fallbacks = [
  "https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200", 
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=200", 
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=200"
];

export function PatientList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProgress, setFilterProgress] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    tutorName: "",
    tutorContact: "",
    location: "",
    status: "Pending" // Adding default status
  });

  useEffect(() => {
    const fetchPts = async () => {
      const user = auth.currentUser;
      if (!user) return setLoading(false);
      
      try {
        const data = await getPatientsByTherapist(user.uid);
        
        // Enhance with deterministic UI mock stats if missing
        const enhanced = data.map(p => {
          let progress = "good";
          if (p.status === "Calm" || p.status === "Active") progress = "excellent";
          else if (p.status === "Overwhelmed" || p.status === "Energetic") progress = "needs-attention";
          else {
            const code = p.id.charCodeAt(0) % 3;
            progress = code === 0 ? "excellent" : code === 1 ? "good" : "needs-attention";
          }
          
          return {
            ...p,
            progress,
            upcomingExercises: (p.id.charCodeAt(p.id.length - 1) % 5) + 1,
            lastSession: p.status === "Pending" ? "No sessions yet" : `${(p.id.charCodeAt(0) % 5) + 1} days ago`
          };
        });
        
        setPatients(enhanced);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    auth.onAuthStateChanged((user) => {
      if (user) fetchPts();
      else setLoading(false);
    });
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      await addPatient({
        therapistId: user.uid,
        name: newPatient.name,
        age: parseInt(newPatient.age) || 0,
        dateOfBirth: newPatient.dateOfBirth,
        tutorName: newPatient.tutorName,
        tutorContact: newPatient.tutorContact,
        location: newPatient.location,
        profilePicture: "",
        status: newPatient.status
      } as any);
      toast.success("Patient added successfully!");
      setShowAddModal(false);
      
      // Refresh list
      const data = await getPatientsByTherapist(user.uid);
      const enhanced = data.map(p => {
          let progress = "good";
          if (p.status === "Calm" || p.status === "Active") progress = "excellent";
          else if (p.status === "Overwhelmed" || p.status === "Energetic") progress = "needs-attention";
          else {
            const code = p.id.charCodeAt(0) % 3;
            progress = code === 0 ? "excellent" : code === 1 ? "good" : "needs-attention";
          }
          return {
            ...p,
            progress,
            upcomingExercises: (p.id.charCodeAt(p.id.length - 1) % 5) + 1,
            lastSession: p.status === "Pending" ? "No sessions yet" : `${(p.id.charCodeAt(0) % 5) + 1} days ago`
          };
      });
      setPatients(enhanced);
      
      // Reset form
      setNewPatient({
        name: "", age: "", dateOfBirth: "", tutorName: "", tutorContact: "", location: "", status: "Pending"
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add patient");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.tutorName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterProgress || patient.progress === filterProgress;
    return matchesSearch && matchesFilter;
  });

  const handlePatientClick = (patientId: string) => {
    navigate(`/therapist/patients/${patientId}`);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading patients...</div>;

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">My Patients</h1>
          <button onClick={() => setShowAddModal(true)} className="p-2">
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
                src={patient.profilePicture || fallbacks[patient.id.charCodeAt(0) % 3]}
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
                  Age {patient.age} • Parent: {patient.tutorName}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      progressColors[patient.progress] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {progressLabels[patient.progress] || patient.progress}
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

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-medium">Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="add-patient-form" onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required type="text" value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" placeholder="e.g. John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input required type="number" value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select value={newPatient.status} onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none">
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Calm">Calm</option>
                      <option value="Overwhelmed">Overwhelmed</option>
                      <option value="Energetic">Energetic</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input required type="text" value={newPatient.dateOfBirth} onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" placeholder="e.g. April 15 2019" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tutor Name</label>
                  <input required type="text" value={newPatient.tutorName} onChange={(e) => setNewPatient({ ...newPatient, tutorName: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" placeholder="e.g. Jane Doe (Mother)" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tutor Email (Contact)</label>
                  <input required type="email" value={newPatient.tutorContact} onChange={(e) => setNewPatient({ ...newPatient, tutorContact: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" placeholder="Must match caregiver's email" />
                  <p className="text-xs text-gray-500 mt-1">This email must be the one the caregiver uses to register.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input required type="text" value={newPatient.location} onChange={(e) => setNewPatient({ ...newPatient, location: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" placeholder="e.g. Miami, FL" />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
              <button type="submit" form="add-patient-form" className="w-full bg-[#9BC9BB] text-gray-900 rounded-xl py-3 font-medium hover:bg-[#8AB9AA] transition-colors">
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav userType="therapist" />
    </div>
  );
}