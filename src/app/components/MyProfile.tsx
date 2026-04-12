import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, ChevronRight, LogOut, Bell, Lock, HelpCircle, FileText, Shield, Trash2, Download, Eye, Mail, Settings } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { BottomNav } from "./BottomNav";

interface MyProfileProps {
  userType?: "therapist" | "caregiver";
}

export function MyProfile({ userType = "therapist" }: MyProfileProps) {
  const navigate = useNavigate();
  const [profileData] = useState({
    name: userType === "therapist" ? "Dr. Sarah Johnson" : "Emily Rodriguez",
    email: userType === "therapist" ? "sarah.johnson@therapy.com" : "emily.rodriguez@email.com",
    role: userType === "therapist" ? "Occupational Therapist" : "Parent/Caregiver",
    avatar: userType === "therapist" 
      ? "https://images.unsplash.com/photo-1612944095914-33fd0a85fcfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
      : "https://images.unsplash.com/photo-1663045281813-c7407a6ec613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    phone: userType === "therapist" ? "+1 (555) 123-4567" : "+1 (555) 987-6543",
    license: userType === "therapist" ? "OT-12345-CA" : undefined,
  });

  const handleLogout = () => {
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 1000);
  };

  const handleChangePhoto = () => {
    toast.info("Photo upload coming soon!");
  };

  const handleEditProfile = () => {
    toast.info("Edit profile coming soon!");
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
        { icon: Trash2, label: "Delete Account", action: () => toast.error("Please contact support to delete your account."), destructive: true },
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
            <ImageWithFallback
              src={profileData.avatar}
              alt={profileData.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              onClick={handleChangePhoto}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#9BC9BB] rounded-full flex items-center justify-center border-2 border-[#F5F2ED]"
            >
              <Camera className="w-4 h-4 text-gray-900" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-medium">{profileData.name}</h2>
          <p className="text-sm text-gray-600">{profileData.role}</p>
          {profileData.license && (
            <p className="text-xs text-gray-500 mt-1">License: {profileData.license}</p>
          )}
        </div>

        {/* Profile Info Cards */}
        <div className="mt-6 space-y-3">
          <div className="bg-white rounded-xl p-4">
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <p className="text-sm font-medium">{profileData.email}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <label className="text-xs text-gray-500 block mb-1">Phone</label>
            <p className="text-sm font-medium">{profileData.phone}</p>
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