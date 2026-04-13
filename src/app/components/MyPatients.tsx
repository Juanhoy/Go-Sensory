import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MoreVertical, Plus, User } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { getPatientsByTherapist } from "../../services/dbService";

export function MyPatients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [patientList, setPatientList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
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
        onClick={() => toast.info("Add new patient feature coming soon!")}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#9BC9BB] rounded-2xl flex items-center justify-center shadow-lg"
      >
        <Plus className="w-8 h-8" />
      </button>

      <BottomNav userType="therapist" />
    </div>
  );
}