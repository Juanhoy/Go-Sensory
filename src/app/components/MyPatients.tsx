import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MoreVertical, Plus, User, X } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { getPatientsByTherapist, addPatient } from "../../services/dbService";

export function MyPatients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [patientList, setPatientList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    const fetchPatients = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await getPatientsByTherapist(user.uid);
        setPatientList(data);
      }
      setLoading(false);
    };
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    
    setLoading(true);
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
      setPatientList(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patientList.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/therapist/home")} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">My Patients</h1>
        <button className="p-2">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mt-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#E8E4DB] rounded-xl px-4 py-3 outline-none"
        />
      </div>

      {/* Patient List */}
      <div className="px-4 space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading patients...</p>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => navigate(`/therapist/patients/${patient.id}`)}
              className="w-full bg-[#F0EBE3] rounded-2xl p-4 flex items-center gap-4"
            >
              {patient.profilePicture ? (
                <img
                  src={patient.profilePicture}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <img
                  src={["https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200", "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=200", "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=200"][patient.id.charCodeAt(0) % 3]}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1 text-left">
                <h3 className="mb-1">{patient.name}</h3>
                <p className="text-sm text-gray-600">{patient.age} years old</p>
                <p className="text-sm text-gray-600">{patient.dateOfBirth}</p>
              </div>
              <MoreVertical className="w-5 h-5" />
            </button>
          ))
        ) : (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No patients found</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#9BC9BB] rounded-2xl flex items-center justify-center shadow-lg"
      >
        <Plus className="w-8 h-8" />
      </button>

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
              <button type="submit" form="add-patient-form" disabled={loading} className="w-full bg-[#9BC9BB] disabled:opacity-50 text-gray-900 rounded-xl py-3 font-medium hover:bg-[#8AB9AA] transition-colors">
                {loading ? "Adding..." : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav userType="therapist" />
    </div>
  );
}