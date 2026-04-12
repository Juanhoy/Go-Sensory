import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MoreVertical, MapPin, Image } from "lucide-react";
import { toast } from "sonner";

export function CaregiverRegister() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      toast.success("Account created successfully!");
      navigate("/caregiver/home");
    }
  };

  return (
    <div className="min-h-screen pb-6 bg-[#F5F2ED]">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Register (Caregiver)</h1>
        <button className="p-2">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 mt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base">Name</label>
            <input
              type="text"
              placeholder="Type your name"
              className="bg-transparent text-right text-gray-400 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Relationship to patient</label>
            <input
              type="text"
              placeholder="e.g., Mother, Father"
              className="bg-transparent text-right text-gray-400 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Patient's name</label>
            <input
              type="text"
              placeholder="Child's name"
              className="bg-transparent text-right text-gray-400 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Date of birth</label>
            <input
              type="text"
              placeholder="June 15, 1995"
              className="bg-transparent text-right text-gray-400 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Email</label>
            <input
              type="email"
              placeholder="yourmail@gmail.com"
              className="bg-transparent text-right text-gray-400 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Contact number</label>
            <input
              type="tel"
              placeholder="+56 458 4485"
              className="bg-transparent text-right text-gray-400 outline-none flex-1 ml-4"
            />
          </div>
        </div>

        {/* Location Button */}
        <button
          type="button"
          onClick={() => toast.info("Location picker opened")}
          className="w-full bg-[#F0EBE3] rounded-2xl py-4 px-6 flex items-center gap-3"
        >
          <MapPin className="w-6 h-6" />
          <span className="text-base">Location</span>
        </button>

        {/* Upload Photo */}
        <button
          type="button"
          onClick={() => toast.info("Photo upload dialog opened")}
          className="w-full border-2 border-[#5C5C8A] rounded-2xl py-4 px-6 flex items-center justify-center gap-3"
        >
          <span className="text-base">Upload patient's photo</span>
          <Image className="w-6 h-6" />
        </button>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-gray-400"
          />
          <label className="text-sm">
            I have read and agree to the terms and conditions.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!agreed}
          className="w-full bg-[#9BC9BB] rounded-2xl py-4 text-base disabled:opacity-50"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}