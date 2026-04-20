import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SlidersHorizontal, Bell, X, Plus, UserPlus, Edit2, Trash2, User } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { getPatientsByTherapist, getAllExercises } from "../../services/dbService";
import { fallbackExercises } from "../data/fallbackExercises";

const patientImages = [
  "https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=200",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=200",
];

export function TherapistHome() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [recentExercises, setRecentExercises] = useState<any[]>([]);

  // Add Patient Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    tutorName: "",
    tutorContact: "",
    location: "",
    status: "Pending"
  });

  const fetchData = async () => {
    const user = auth.currentUser;
    if (user) {
      const pts = await getPatientsByTherapist(user.uid);
      setPatients(pts);
    }
    
    const allEx = await getAllExercises();
    const merged = [...allEx, ...fallbackExercises];
    setRecentExercises(merged.slice(0, 3));
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
        if (user) fetchData();
    });
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const { addPatient } = await import("../../services/dbService");
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
      setNewPatient({
        name: "", age: "", dateOfBirth: "", tutorName: "", tutorContact: "", location: "", status: "Pending"
      });
      fetchData(); // Refresh circles
    } catch (error: any) {
      toast.error(error.message || "Failed to add patient");
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/img/gosensorylogo.png" 
            alt="Go Sensory" 
            className="h-10 w-auto object-contain cursor-pointer"
            onClick={() => navigate("/therapist/home")}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Settings opened")}
            className="p-2 bg-[#9BC9BB] rounded-xl"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={() => toast.info("No new notifications")}
            className="p-2 bg-[#9BC9BB] rounded-xl"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {showNotification && (
        <div className="mx-4 mb-4 bg-[#F9DC5C] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
          <span className="text-sm font-medium">Anna Varsky's Tutor has contacted you</span>
          <button onClick={() => setShowNotification(false)} className="p-1 hover:bg-[#E5CB55] rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Patient Circles AT TOP */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {patients.map((pt, idx) => (
            <button
              key={pt.id}
              onClick={() => navigate(`/therapist/patients/${pt.id}`)}
              className="relative flex-shrink-0 group"
            >
              <ImageWithFallback
                src={pt.profilePicture || patientImages[pt.id.charCodeAt(0) % 3]}
                alt={pt.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#9BC9BB] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              />
              <div className="absolute -bottom-1 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${pt.status === "Pending" ? "bg-[#F9DC5C]" : "bg-green-500"}`} />
              </div>
            </button>
          ))}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-16 h-16 rounded-full bg-[#9BC9BB] flex items-center justify-center flex-shrink-0 text-white hover:bg-[#8AB9AA] transition-colors shadow-[0_2px_8px_rgba(155,201,187,0.4)]"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-medium text-gray-900">Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="add-patient-form-home" onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Name</label>
                  <input required type="text" value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full bg-[#F5F2ED] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#9BC9BB] transition-all" placeholder="e.g. John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Age</label>
                    <input required type="number" value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} className="w-full bg-[#F5F2ED] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#9BC9BB] transition-all" placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">Status</label>
                    <select value={newPatient.status} onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })} className="w-full bg-[#F5F2ED] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#9BC9BB] transition-all appearance-none cursor-pointer">
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Calm">Calm</option>
                      <option value="Overwhelmed">Overwhelmed</option>
                      <option value="Energetic">Energetic</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Date of Birth</label>
                  <input required type="text" value={newPatient.dateOfBirth} onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })} className="w-full bg-[#F5F2ED] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#9BC9BB] transition-all" placeholder="e.g. April 15 2019" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Tutor Name</label>
                  <input required type="text" value={newPatient.tutorName} onChange={(e) => setNewPatient({ ...newPatient, tutorName: e.target.value })} className="w-full bg-[#F5F2ED] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#9BC9BB] transition-all" placeholder="e.g. Jane Doe (Mother)" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Tutor Email (Contact)</label>
                  <input required type="email" value={newPatient.tutorContact} onChange={(e) => setNewPatient({ ...newPatient, tutorContact: e.target.value })} className="w-full bg-[#F5F2ED] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#9BC9BB] transition-all" placeholder="caregiver@email.com" />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-tight">Must match the email the caregiver uses to register.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Location</label>
                  <input required type="text" value={newPatient.location} onChange={(e) => setNewPatient({ ...newPatient, location: e.target.value })} className="w-full bg-[#F5F2ED] rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[#9BC9BB] transition-all" placeholder="e.g. Miami, FL" />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
              <button type="submit" form="add-patient-form-home" className="w-full bg-[#9BC9BB] text-gray-900 rounded-xl py-3.5 font-medium hover:bg-[#8AB9AA] transition-colors shadow-md">
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Exercises */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Exercises</h2>
          <button
            onClick={() => navigate("/therapist/exercise-library")}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            See All
          </button>
        </div>

        <div className="space-y-4">
          {recentExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-[#F0EBE3] rounded-3xl p-4 cursor-pointer hover:bg-[#E8E3D8] transition-colors shadow-sm"
              onClick={() => navigate(`/therapist/exercise/${exercise.id}`)}
            >
              <div className="flex gap-4">
                <div className="flex-1 min-w-0 flex flex-col">
                  <div>
                    <h3 className="font-medium mb-1 line-clamp-1">{exercise.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{exercise.duration || exercise.time || "N/A"}</p>
                    <div className="mb-2">
                      <span className="inline-block bg-[#E88D67] text-white text-[11px] px-3 py-1 rounded-full font-medium">
                        {exercise.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {exercise.description}
                    </p>
                  </div>

                  <div className="space-y-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() =>
                        navigate(`/therapist/exercise-library`)
                      }
                      className="w-full bg-[#9BC9BB] hover:bg-[#8AB9AA] text-gray-900 transition-colors rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-[13px] font-medium shadow-[0_2px_8px_rgba(155,201,187,0.3)]"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign to Patient
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toast.info("Edit feature coming soon for specific exercises")}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-white text-gray-700 transition-all rounded-full py-2 px-4 flex items-center justify-center gap-1.5 text-[13px] font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <ImageWithFallback
                  src={exercise.imageUrl || exercise.steps?.[0]?.image || "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400"}
                  alt={exercise.name}
                  className="w-[100px] h-full min-h-[160px] rounded-2xl object-cover flex-shrink-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#9BC9BB]" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>

      <BottomNav userType="therapist" />
    </div>
  );
}