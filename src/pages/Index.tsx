import { useState } from "react";
import InternshipCard from "@/components/InternshipCard";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { Target, TrendingUp, Award } from "lucide-react";

const sampleInternships = [
  {
    id: "1",
    title: "Full Stack Development",
    company: "TechCorp Solutions",
    isVerified: true,
    location: "Bangalore, India",
    mode: "Hybrid" as const,
    duration: "3 months",
    description: "Work on cutting-edge web applications using React, Node.js, and cloud technologies. Gain hands-on experience in modern development practices.",
    skills: ["React", "Node.js", "JavaScript", "MongoDB", "AWS"],
    deadline: "Jan 15, 2024",
    isPaid: true,
    stipend: "₹15,000/month",
    tags: ["Web Development", "Full Stack", "JavaScript"],
  },
  {
    id: "2",
    title: "Machine Learning Engineer",
    company: "AI Innovations Ltd",
    isVerified: true,
    location: "Mumbai, India",
    mode: "Remote" as const,
    duration: "6 months",
    description: "Develop and deploy machine learning models for real-world applications. Work with cutting-edge AI technologies and learn from industry experts.",
    skills: ["Python", "TensorFlow", "PyTorch", "Pandas", "Scikit-learn"],
    deadline: "Jan 20, 2024",
    isPaid: true,
    stipend: "₹20,000/month",
    tags: ["AI", "Machine Learning", "Python"],
  },
  {
    id: "3",
    title: "Mechanical Design Intern",
    company: "AutoTech Engineering",
    isVerified: true,
    location: "Chennai, India",
    mode: "On-site" as const,
    duration: "4 months",
    description: "Design and prototype automotive components using CAD software. Collaborate with senior engineers on innovative vehicle technologies.",
    skills: ["AutoCAD", "SolidWorks", "CATIA", "Mechanical Design"],
    deadline: "Jan 10, 2024",
    isPaid: true,
    stipend: "₹12,000/month",
    tags: ["Mechanical", "CAD", "Automotive"],
  },
  {
    id: "4",
    title: "Data Science Analyst",
    company: "Analytics Pro",
    isVerified: false,
    location: "Delhi, India",
    mode: "Remote" as const,
    duration: "3 months",
    description: "Analyze large datasets to extract meaningful insights. Work with statistical models and visualization tools to support business decisions.",
    skills: ["Python", "R", "SQL", "Tableau", "Excel"],
    deadline: "Jan 25, 2024",
    isPaid: false,
    tags: ["Data Science", "Analytics", "Statistics"],
  },
  {
    id: "5",
    title: "Mobile App Development",
    company: "AppVenture Studio",
    isVerified: true,
    location: "Hyderabad, India",
    mode: "Hybrid" as const,
    duration: "4 months",
    description: "Build native and cross-platform mobile applications. Learn modern mobile development frameworks and user experience design principles.",
    skills: ["React Native", "Flutter", "JavaScript", "Dart", "Firebase"],
    deadline: "Jan 30, 2024",
    isPaid: true,
    stipend: "₹18,000/month",
    tags: ["Mobile", "React Native", "Flutter"],
  },
  {
    id: "6",
    title: "Cybersecurity Analyst",
    company: "SecureNet Systems",
    isVerified: true,
    location: "Pune, India",
    mode: "On-site" as const,
    duration: "6 months",
    description: "Learn about network security, threat detection, and incident response. Work with cybersecurity tools and help protect digital infrastructure.",
    skills: ["Network Security", "Penetration Testing", "SIEM", "Python"],
    deadline: "Feb 5, 2024",
    isPaid: true,
    stipend: "₹16,000/month",
    tags: ["Cybersecurity", "Network", "Security"],
  },
];

const Index = () => {
  const { profile } = useProfile();
  const [bookmarkedIds, setBookmarkedIds] = useState(["2", "5"]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) 
        ? prev.filter(bookmarkId => bookmarkId !== id)
        : [...prev, id]
    );
  };

  // Calculate skill matches for each internship
  const getSkillMatch = (internshipSkills: string[]) => {
    if (profile.skills.length === 0) return 0;
    const matches = internshipSkills.filter(skill => 
      profile.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.round((matches.length / internshipSkills.length) * 100);
  };

  // Get personalized recommendations
  const getPersonalizedInternships = () => {
    return sampleInternships
      .map(internship => ({
        ...internship,
        skillMatch: getSkillMatch(internship.skills)
      }))
      .sort((a, b) => b.skillMatch - a.skillMatch);
  };

  const personalizedInternships = getPersonalizedInternships();

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Discover Internships
          </h2>
          <p className="text-muted-foreground">
            Find the perfect internship opportunities that match your skills and interests
          </p>
        </div>

        {/* Personalized Insights */}
        {profile.skills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Match</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {personalizedInternships[0]?.skillMatch || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Best skill match found
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skills Added</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.skills.length}</div>
                <p className="text-xs text-muted-foreground">
                  Technical skills in profile
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookmarkedIds.length}</div>
                <p className="text-xs text-muted-foreground">
                  Saved internships
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skill Gap Analysis */}
        {profile.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>
                See how your skills match with available internships and where to improve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalizedInternships.slice(0, 3).map((internship) => {
                  const missingSkills = internship.skills.filter(skill => 
                    !profile.skills.some(userSkill => 
                      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                      skill.toLowerCase().includes(userSkill.toLowerCase())
                    )
                  );

                  return (
                    <div key={internship.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{internship.title}</h4>
                          <p className="text-sm text-muted-foreground">{internship.company}</p>
                        </div>
                        <Badge variant={internship.skillMatch > 60 ? "default" : "secondary"}>
                          {internship.skillMatch}% match
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Skill Match</span>
                          <span>{internship.skillMatch}%</span>
                        </div>
                        <Progress value={internship.skillMatch} className="h-2" />
                      </div>
                      {missingSkills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Skills to develop:</p>
                          <div className="flex flex-wrap gap-1">
                            {missingSkills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Curated Internships Feed */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {profile.skills.length > 0 ? "Recommended for You" : "All Internships"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {personalizedInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                {...internship}
                isBookmarked={bookmarkedIds.includes(internship.id)}
                onBookmarkToggle={() => toggleBookmark(internship.id)}
                skillMatch={internship.skillMatch}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
