import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MoreVertical, MapPin, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { saveUserProfile, uploadMediaToCloudinary } from "../../services/dbService";

export function RegisterTherapist() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    expertise: "",
    dateOfBirth: "",
    email: "",
    password: "", // User will need this for email/password auth
    phone: "",
    location: "Miami, FL"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const loadingToast = toast.loading("Uploading photo...");
      try {
        const result = await uploadMediaToCloudinary(file);
        setPhotoUrl(result.secure_url);
        toast.dismiss(loadingToast);
        toast.success("Photo uploaded!");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Upload failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    if (!formData.email || !formData.password) {
      return toast.error("Email and Password are required");
    }

    setLoading(true);
    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Auth Profile
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: photoUrl
      });

      // 3. Save to Firestore
      await saveUserProfile(user.uid, {
        ...formData,
        photoURL: photoUrl,
        userType: "therapist",
        createdAt: new Date().toISOString()
      });

      toast.success("Account created successfully!");
      navigate("/therapist/home");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Register (Therapist)</h1>
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
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-transparent text-right text-gray-700 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">ID</label>
            <input
              type="text"
              placeholder="Enter your ID"
              value={formData.id}
              onChange={(e) => handleInputChange("id", e.target.value)}
              className="bg-transparent text-right text-gray-700 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Expertise</label>
            <input
              type="text"
              placeholder="Expertise"
              value={formData.expertise}
              onChange={(e) => handleInputChange("expertise", e.target.value)}
              className="bg-transparent text-right text-gray-700 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Date of birth</label>
            <input
              type="text"
              placeholder="June 15, 1995"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="bg-transparent text-right text-gray-700 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Email</label>
            <input
              type="email"
              placeholder="yourmail@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-transparent text-right text-gray-700 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Password</label>
            <input
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="bg-transparent text-right text-gray-700 outline-none flex-1 ml-4"
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <label className="text-base">Contact number</label>
            <input
              type="tel"
              placeholder="+56 458 4485"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-transparent text-right text-gray-700 outline-none flex-1 ml-4"
            />
          </div>
        </div>

        {/* Location Button */}
        <button
          type="button"
          onClick={() => toast.info("Location is set to: " + formData.location)}
          className="w-full bg-[#F0EBE3] rounded-2xl py-4 px-6 flex items-center gap-3"
        >
          <MapPin className="w-6 h-6" />
          <span className="text-base">Location (Fixed for MVP)</span>
        </button>

        {/* Upload Photo */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            id="photo-upload"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <button
            type="button"
            onClick={() => document.getElementById("photo-upload")?.click()}
            className="w-full border-2 border-[#5C5C8A] rounded-2xl py-4 px-6 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors"
          >
            {photoUrl ? (
              <img src={photoUrl} className="w-8 h-8 rounded-full object-cover" alt="Preview" />
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
            <span className="text-base">{photoUrl ? "Photo Uploaded!" : "Upload your photo"}</span>
          </button>
        </div>

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
          disabled={!agreed || loading}
          className="w-full bg-[#9BC9BB] rounded-2xl py-4 text-base disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}