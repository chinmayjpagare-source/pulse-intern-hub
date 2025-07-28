import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";

const defaultProfile: UserProfile = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "",
    location: "",
  },
  academic: {
    degree: "",
    year: "",
    gpa: "",
    university: "",
  },
  skills: [],
  preferences: {
    preferredDuration: "",
    preferredMode: "Remote",
    preferredLocation: "",
  },
};

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    const savedProfile = localStorage.getItem("user-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem("user-profile", JSON.stringify(updatedProfile));
  };

  const getProfileCompleteness = () => {
    const fields = [
      profile.personalInfo.name,
      profile.personalInfo.email,
      profile.personalInfo.phone,
      profile.personalInfo.location,
      profile.academic.degree,
      profile.academic.year,
      profile.academic.gpa,
      profile.academic.university,
      profile.skills.length > 0,
      profile.preferences.preferredDuration,
      profile.preferences.preferredMode,
      profile.preferences.preferredLocation,
      profile.resume,
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  return {
    profile,
    updateProfile,
    getProfileCompleteness,
  };
};