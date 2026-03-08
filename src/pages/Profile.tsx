import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { SkillInput } from "@/components/ui/skill-input";
import { useProfile } from "@/hooks/useProfile";
import { useResumeParser } from "@/hooks/useResumeParser";
import { User, GraduationCap, Settings as SettingsIcon, FileText, Sparkles, Loader2 } from "lucide-react";

const Profile = () => {
  const { profile, updateProfile, getProfileCompleteness } = useProfile();
  const { uploadAndParse, isParsing } = useResumeParser(updateProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handlePersonalInfoUpdate = (field: string, value: string) => {
    updateProfile({
      personalInfo: { ...profile.personalInfo, [field]: value }
    });
  };

  const handleAcademicUpdate = (field: string, value: string) => {
    updateProfile({
      academic: { ...profile.academic, [field]: value }
    });
  };

  const handleSkillsUpdate = (skills: string[]) => {
    updateProfile({ skills });
  };

  const handlePreferencesUpdate = (field: string, value: string) => {
    updateProfile({
      preferences: { ...profile.preferences, [field]: value }
    });
  };

  const handleResumeUpload = (file: File | null) => {
    updateProfile({ resume: file || undefined });
  };

  const completeness = getProfileCompleteness();

  const handleSearch = (query: string) => {
    // Profile search could scroll to relevant sections or highlight matching fields
    console.log(`Searching profile for: ${query}`);
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your profile information and preferences</p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? "Done" : "Edit Profile"}
          </Button>
        </div>

        {/* Profile Completeness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Profile Completeness
            </CardTitle>
            <CardDescription>
              Complete your profile to get better internship recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.personalInfo.name}
                  onChange={(e) => handlePersonalInfoUpdate("name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.personalInfo.email}
                  onChange={(e) => handlePersonalInfoUpdate("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoUpdate("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.personalInfo.location}
                  onChange={(e) => handlePersonalInfoUpdate("location", e.target.value)}
                  disabled={!isEditing}
                  placeholder="City, State"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Select 
                  value={profile.academic.degree} 
                  onValueChange={(value) => handleAcademicUpdate("degree", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTech">B.Tech</SelectItem>
                    <SelectItem value="BE">B.E.</SelectItem>
                    <SelectItem value="BSc">B.Sc</SelectItem>
                    <SelectItem value="MTech">M.Tech</SelectItem>
                    <SelectItem value="ME">M.E.</SelectItem>
                    <SelectItem value="MSc">M.Sc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Select 
                  value={profile.academic.year} 
                  onValueChange={(value) => handleAcademicUpdate("year", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                    <SelectItem value="Final">Final Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA/Percentage</Label>
                <Input
                  id="gpa"
                  value={profile.academic.gpa}
                  onChange={(e) => handleAcademicUpdate("gpa", e.target.value)}
                  disabled={!isEditing}
                  placeholder="8.5 or 85%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University/College</Label>
                <Input
                  id="university"
                  value={profile.academic.university}
                  onChange={(e) => handleAcademicUpdate("university", e.target.value)}
                  disabled={!isEditing}
                  placeholder="University name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your technical and soft skills</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillInput
              skills={profile.skills}
              onSkillsChange={handleSkillsUpdate}
              placeholder="Type a skill and press Enter..."
            />
          </CardContent>
        </Card>

        {/* Resume Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume
            </CardTitle>
            <CardDescription>Upload your latest resume (PDF, DOC, DOCX)</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFileSelect={handleResumeUpload}
              currentFile={profile.resume}
            />
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Internship Preferences</CardTitle>
            <CardDescription>Set your preferred internship criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Preferred Duration</Label>
                <Select 
                  value={profile.preferences.preferredDuration} 
                  onValueChange={(value) => handlePreferencesUpdate("preferredDuration", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="3-4 months">3-4 months</SelectItem>
                    <SelectItem value="5-6 months">5-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Work Mode</Label>
                <Select 
                  value={profile.preferences.preferredMode} 
                  onValueChange={(value) => handlePreferencesUpdate("preferredMode", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Location</Label>
                <Input
                  value={profile.preferences.preferredLocation}
                  onChange={(e) => handlePreferencesUpdate("preferredLocation", e.target.value)}
                  disabled={!isEditing}
                  placeholder="City preference"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;