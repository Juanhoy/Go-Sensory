import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, ChevronRight, LogOut, Bell, Lock, HelpCircle, FileText, Shield, Trash2, Download, Eye, Mail, Settings } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { BottomNav } from "./BottomNav";
import { auth } from "../../lib/firebase";
import { deleteUser, signOut, updateProfile } from "firebase/auth";
import { deleteUserAccount, getUserProfile, saveUserProfile, uploadMediaToCloudinary } from "../../services/dbService";
import { useEffect } from "react";

interface MyProfileProps {
  userType?: "therapist" | "caregiver";
}

export function MyProfile({ userType = "therapist" }: MyProfileProps) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await getUserProfile(user.uid);
        setProfileData(data || {
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          userType: userType
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userType]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteUserAccount(user.uid);
          await deleteUser(user);
          toast.success("Account deleted successfully");
          navigate("/");
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to delete account. You may need to re-login to perform this action.");
      }
    }
  };

  const handleChangePhoto = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const loadingToast = toast.loading("Uploading photo...");
        try {
          const result = await uploadMediaToCloudinary(file);
          const newPhotoUrl = result.secure_url;
          
          if (auth.currentUser) {
            // Update Firestore
            await saveUserProfile(auth.currentUser.uid, { photoURL: newPhotoUrl });
            
            // Update Firebase Auth Profile (for BottomNav sync)
            await updateProfile(auth.currentUser, { photoURL: newPhotoUrl });
            
            setProfileData((prev: any) => ({ ...prev, photoURL: newPhotoUrl }));
            toast.dismiss(loadingToast);
            toast.success("Photo updated!");
          }
        } catch (error: any) {
          toast.dismiss(loadingToast);
          toast.error(error.message || "Upload failed");
        }
      }
    };
    input.click();
  };

  const handleEditProfile = () => {
    toast.info("Profile editing is active! Just change your photo or contact settings.");
  };

  const settingsSections = [
    {
      title: "Settings",
      items: [
        { icon: Settings, label: "Account Settings", action: () => toast.info("Account settings coming soon!") },
        { icon: Bell, label: "Notifications", action: () => toast.info("Notification settings coming soon!") },
        { icon: Lock, label: "Password & Security", action: () => toast.info("Security settings coming soon!") },
        { icon: Mail, label: "Email Preferences", action: () => toast.info("Email preferences coming soon!") },
      ],
    },
    {
      title: "Privacy & Data",
      items: [
        { icon: Shield, label: "Privacy Policy", action: () => toast.info("Opening privacy policy...") },
        { icon: Eye, label: "Data & Privacy Settings", action: () => toast.info("Privacy settings coming soon!") },
        { icon: Download, label: "Download My Data", action: () => toast.info("Your data download will begin shortly...") },
        { icon: Trash2, label: "Delete Account", action: handleDeleteAccount, destructive: true },
      ],
    },
    {
      title: "Legal",
      items: [
        { icon: FileText, label: "Terms of Service", action: () => toast.info("Opening terms of service...") },
        { icon: FileText, label: "End User License Agreement", action: () => toast.info("Opening EULA...") },
        { icon: Shield, label: "Cookie Policy", action: () => toast.info("Opening cookie policy...") },
        { icon: FileText, label: "Accessibility Statement", action: () => toast.info("Opening accessibility statement...") },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", action: () => toast.info("Opening help center...") },
        { icon: Mail, label: "Contact Support", action: () => toast.info("Opening contact form...") },
        { icon: FileText, label: "Report a Problem", action: () => toast.info("Opening problem report form...") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24">
      {/* Header */}
      <div className="bg-[#F5F2ED] sticky top-0 z-10 border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">My Profile</h1>
          <button onClick={handleEditProfile} className="text-sm text-[#9BC9BB] font-medium">
            Edit
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 pt-6 pb-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            {profileData?.photoURL ? (
              <img
                src={profileData.photoURL}
                alt={profileData.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <button
              onClick={handleChangePhoto}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#9BC9BB] rounded-full flex items-center justify-center border-2 border-[#F5F2ED]"
            >
              <Camera className="w-4 h-4 text-gray-900" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-medium">{profileData?.name || "Anonymous User"}</h2>
          <p className="text-sm text-gray-600 capitalize">{profileData?.userType || userType}</p>
        </div>

        {/* Profile Info Cards */}
        <div className="mt-6 space-y-3">
          <div className="bg-white rounded-xl p-4">
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <p className="text-sm font-medium">{profileData?.email || "No email provided"}</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-4 space-y-6">
        {settingsSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-medium text-gray-600 mb-3 px-2">{section.title}</h3>
            <div className="bg-white rounded-xl overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    itemIdx !== section.items.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${(item as any).destructive ? 'text-red-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${(item as any).destructive ? 'text-red-600' : ''}`}>{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl p-4 flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>

        {/* Version Info */}
        <div className="text-center text-xs text-gray-400 py-4">
          Version 1.0.0
        </div>
      </div>

      <BottomNav userType={userType} />
    </div>
  );
}