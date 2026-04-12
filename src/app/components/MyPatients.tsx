import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MoreVertical, Plus } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { patients } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

const patientImages = [
  "https://images.unsplash.com/photo-1644966825640-bf597f873b89?w=200",
  "https://images.unsplash.com/photo-1716936210182-d3b7af967b04?w=200",
  "https://images.unsplash.com/photo-1768844871840-26f6ed6a8e39?w=200",
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200",
  "https://images.unsplash.com/photo-1588183719635-fc89a88e5e2c?w=200",
];

export function MyPatients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
        {patients.map((patient, idx) => (
          <button
            key={patient.id}
            onClick={() => navigate(`/therapist/patients/${patient.id}`)}
            className="w-full bg-[#F0EBE3] rounded-2xl p-4 flex items-center gap-4"
          >
            <ImageWithFallback
              src={patientImages[idx % patientImages.length]}
              alt={patient.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1 text-left">
              <h3 className="mb-1">{patient.name}</h3>
              <p className="text-sm text-gray-600">{patient.age} años</p>
              <p className="text-sm text-gray-600">{patient.dateOfBirth}</p>
            </div>
            <MoreVertical className="w-5 h-5" />
          </button>
        ))}
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