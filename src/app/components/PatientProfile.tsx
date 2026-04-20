import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MoreVertical, X, Trash2, Edit2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { getPatientById, updatePatient, deletePatient, listenToTherapistAgenda, getAllExercises } from "../../services/dbService";

const exerciseImages = [
  "https://images.unsplash.com/photo-1763013259112-15f293b6d481?w=400",
  "https://images.unsplash.com/photo-1630571050152-49d673ccfe13?w=400",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=400",
];

export function PatientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [patientExercises, setPatientExercises] = useState<any[]>([]);
  const [exercisesData, setExercisesData] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  
  // Edit logic
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});
  
  const filters = ["Pending", "Done", "Missed", "On Course"];

  useEffect(() => {
    let unsubscribeAgenda: (() => void) | undefined;
    
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user || !id) {
        setLoading(false);
        return;
      }
      
      try {
        const pt = await getPatientById(id);
        setPatient(pt);
        setEditData(pt || {});
        
        const allEx = await getAllExercises();
        setExercisesData(allEx);
        
        unsubscribeAgenda = listenToTherapistAgenda(user.uid, id, (agenda) => {
          setPatientExercises(agenda.map((a: any) => ({
            ...a,
            exercise: allEx.find(e => e.id === a.exerciseId)
          })));
        });
      } catch(e) {
         console.error(e);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeAgenda) unsubscribeAgenda();
    };
  }, [id]);

  const handleEditPatient = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!id) return;
     try {
       await updatePatient(id, editData);
       setPatient(editData);
       setShowEditModal(false);
       toast.success("Patient updated");
     } catch(e) {
       toast.error("Failed to update patient");
     }
  };

  const handleDeletePatient = async () => {
    if(!id) return;
    if(window.confirm("Are you sure you want to delete this patient and all their data?")) {
      try {
        await deletePatient(id);
        toast.success("Patient deleted");
        navigate("/therapist/patients");
      } catch(e) {
        toast.error("Failed to delete patient");
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!patient) return <div className="p-8 text-center text-gray-500">Patient not found</div>;

  const filteredExercises = patientExercises.filter((item) => item.status === activeFilter);

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/therapist/patients")} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">{patient.name}</h1>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowEditModal(true)} className="p-2 text-[#9BC9BB]">
            <Edit2 className="w-5 h-5" />
          </button>
          <button onClick={handleDeletePatient} className="p-2 text-red-500">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="px-4 mt-6 mb-6">
        <div className="bg-[#F0EBE3] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <ImageWithFallback
                src={patient.profilePicture || ["https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200", "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=200", "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=200"][patient.id?.charCodeAt(0) % 3 || 0]}
                alt={patient.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full" />
              </div>
              <div className="mt-2 text-xs flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>{patient.status}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg mb-1">{patient.name}</h2>
              <p className="text-sm text-gray-600">{patient.age} years old</p>
              <p className="text-sm text-gray-600">{patient.dateOfBirth}</p>
              <p className="text-sm text-gray-600">Tutor: {patient.tutor}</p>
              <p className="text-sm text-gray-600">{patient.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensory Diet Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">Sensory Diet</h2>
          <button
            onClick={() => navigate(`/therapist/patients/${id}/diet`)}
            className="text-sm underline"
          >
            See Detail
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-[#9BC9BB]"
                  : "bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Exercise Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {filteredExercises.length > 0 ? filteredExercises.map((item, idx) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-48 bg-white rounded-xl overflow-hidden"
            >
              <ImageWithFallback
                src={exerciseImages[idx % exerciseImages.length]}
                alt={item.exercise?.name || "Exercise"}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm mb-2">{item.exercise?.name || "Unknown"}</h3>
                <div
                  className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
                    item.status === "Pending" ? "bg-[#F9DC5C]" : "bg-gray-200"
                  }`}
                >
                  {item.status}
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Repeats: {item.repeats?.join(", ") || "None"}
                </p>
                <p className="text-xs text-gray-600">{item.startTime}</p>
              </div>
            </div>
          )) : (
            <p className="text-gray-500 text-sm">No exercises found for this filter.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 space-y-3">
        <button
          onClick={() => navigate(`/therapist/patients/${id}/diet`)}
          className="w-full border-2 border-gray-900 rounded-2xl py-4"
        >
          Edit Diet
        </button>
        <button
          onClick={() => {
            if(patient.tutorContact) {
              window.location.href = `mailto:${patient.tutorContact}`;
            } else {
              toast.error("No contact email found");
            }
          }}
          className="w-full bg-[#9BC9BB] rounded-2xl py-4"
        >
          Contact tutor
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-medium">Edit Patient</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="edit-patient-form" onSubmit={handleEditPatient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input required type="number" value={editData.age} onChange={(e) => setEditData({ ...editData, age: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none">
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Calm">Calm</option>
                      <option value="Overwhelmed">Overwhelmed</option>
                      <option value="Energetic">Energetic</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tutor Name</label>
                  <input required type="text" value={editData.tutorName} onChange={(e) => setEditData({ ...editData, tutorName: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tutor Contact</label>
                  <input required type="email" value={editData.tutorContact} onChange={(e) => setEditData({ ...editData, tutorContact: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input required type="text" value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none" />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
              <button type="submit" form="edit-patient-form" className="w-full bg-[#9BC9BB] text-gray-900 rounded-xl py-3 font-medium hover:bg-[#8AB9AA] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}