import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/types/profile";

interface ParsedResumeData {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  degree?: string;
  university?: string;
  gpa?: string;
  year?: string;
  skills?: string[];
}

export const useResumeParser = (
  updateProfile: (updates: Partial<UserProfile>) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isParsing, setIsParsing] = useState(false);

  const uploadAndParse = async (file: File) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the resume parser.",
        variant: "destructive",
      });
      return;
    }

    setIsParsing(true);
    try {
      // Upload to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Call parse edge function
      const { data, error } = await supabase.functions.invoke("parse-resume", {
        body: { storagePath: filePath },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      const parsed: ParsedResumeData = data?.data;
      if (!parsed) throw new Error("No data returned from parser");

      // Map parsed data to profile updates
      const updates: Partial<UserProfile> = {};

      if (parsed.full_name || parsed.email || parsed.phone || parsed.location) {
        updates.personalInfo = {
          name: parsed.full_name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          location: parsed.location || "",
        };
      }

      if (parsed.degree || parsed.university || parsed.gpa || parsed.year) {
        updates.academic = {
          degree: parsed.degree || "",
          university: parsed.university || "",
          gpa: parsed.gpa || "",
          year: parsed.year || "",
        };
      }

      if (parsed.skills && parsed.skills.length > 0) {
        updates.skills = parsed.skills;
      }

      updates.resume = file;
      updateProfile(updates);

      toast({
        title: "Resume parsed!",
        description: "Your profile has been auto-filled from your resume.",
      });
    } catch (err: any) {
      console.error("Resume parse error:", err);
      toast({
        title: "Parsing failed",
        description: err.message || "Could not parse resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  return { uploadAndParse, isParsing };
};
