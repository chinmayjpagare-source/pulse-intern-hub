export interface UserProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  academic: {
    degree: string;
    year: string;
    gpa: string;
    university: string;
  };
  skills: string[];
  preferences: {
    preferredDuration: string;
    preferredMode: "Remote" | "On-site" | "Hybrid";
    preferredLocation: string;
  };
  resume?: File;
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  appliedDate: string;
  status: "pending" | "accepted" | "rejected";
}