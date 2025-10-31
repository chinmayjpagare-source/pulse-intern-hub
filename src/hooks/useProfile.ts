import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";

const defaultProfile: UserProfile = {
  personalInfo: {
    name: "",
    email: "",
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(false);

  // Fetch profile from backend on mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      // If no user, load from localStorage
      const savedProfile = localStorage.getItem("user-profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        // Merge backend data with default profile structure
        const fetchedProfile: UserProfile = {
          personalInfo: {
            name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
          },
          academic: {
            degree: data.degree || "",
            year: data.year || "",
            gpa: data.gpa || "",
            university: data.university || "",
          },
          skills: data.skills || [],
          preferences: {
            preferredDuration: data.preferred_duration || "",
            preferredMode: (data.preferred_mode || "Remote") as "Remote" | "On-site" | "Hybrid",
            preferredLocation: data.preferred_location || "",
          },
        };
        setProfile(fetchedProfile);
        localStorage.setItem("user-profile", JSON.stringify(fetchedProfile));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) {
      // If no user, just save to localStorage
      localStorage.setItem("user-profile", JSON.stringify(profile));
      toast({
        title: "Success",
        description: "Profile saved locally. Sign in to sync across devices.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.personalInfo.name,
          email: profile.personalInfo.email,
          phone: profile.personalInfo.phone,
          location: profile.personalInfo.location,
          degree: profile.academic.degree,
          year: profile.academic.year,
          gpa: profile.academic.gpa,
          university: profile.academic.university,
          skills: profile.skills,
          preferred_duration: profile.preferences.preferredDuration,
          preferred_mode: profile.preferences.preferredMode,
          preferred_location: profile.preferences.preferredLocation,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      localStorage.setItem("user-profile", JSON.stringify(profile));
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully!",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    // Auto-save to localStorage for immediate updates
    localStorage.setItem("user-profile", JSON.stringify(updatedProfile));
    
    // Auto-save to backend if user is logged in
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updatedProfile.personalInfo.name,
            email: updatedProfile.personalInfo.email,
            phone: updatedProfile.personalInfo.phone,
            location: updatedProfile.personalInfo.location,
            degree: updatedProfile.academic.degree,
            year: updatedProfile.academic.year,
            gpa: updatedProfile.academic.gpa,
            university: updatedProfile.academic.university,
            skills: updatedProfile.skills,
            preferred_duration: updatedProfile.preferences.preferredDuration,
            preferred_mode: updatedProfile.preferences.preferredMode,
            preferred_location: updatedProfile.preferences.preferredLocation,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error auto-saving profile:', error);
      }
    }
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
    saveProfile,
    getProfileCompleteness,
    loading,
  };
};