import { useState, useEffect } from "react";
import InternshipCard from "@/components/InternshipCard";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { useToast } from "@/components/ui/use-toast";
import { Target, TrendingUp, Award, Filter, ExternalLink } from "lucide-react";
import { sampleInternships } from "@/data/internships";

// Learning resources for skills
const skillResources: Record<string, string> = {
  "React": "https://react.dev/learn",
  "Node.js": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
  "JavaScript": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  "TypeScript": "https://www.typescriptlang.org/docs/handbook/intro.html",
  "Python": "https://docs.python.org/3/tutorial/",
  "Java": "https://docs.oracle.com/javase/tutorial/",
  "C++": "https://cplusplus.com/doc/tutorial/",
  "MongoDB": "https://www.mongodb.com/docs/manual/tutorial/",
  "PostgreSQL": "https://www.postgresql.org/docs/current/tutorial.html",
  "SQL": "https://www.w3schools.com/sql/",
  "AWS": "https://aws.amazon.com/getting-started/",
  "Docker": "https://docs.docker.com/get-started/",
  "Kubernetes": "https://kubernetes.io/docs/tutorials/",
  "TensorFlow": "https://www.tensorflow.org/tutorials",
  "PyTorch": "https://pytorch.org/tutorials/",
  "Machine Learning": "https://www.coursera.org/learn/machine-learning",
  "Data Science": "https://www.kaggle.com/learn",
  "React Native": "https://reactnative.dev/docs/getting-started",
  "Flutter": "https://docs.flutter.dev/get-started/learn-more",
  "Firebase": "https://firebase.google.com/docs/guides",
  "Git": "https://git-scm.com/doc",
  "HTML": "https://developer.mozilla.org/en-US/docs/Learn/HTML",
  "CSS": "https://developer.mozilla.org/en-US/docs/Learn/CSS",
  "Tailwind": "https://tailwindcss.com/docs",
  "Express": "https://expressjs.com/en/starter/installing.html",
  "Django": "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
  "Flask": "https://flask.palletsprojects.com/en/stable/tutorial/",
  "Vue": "https://vuejs.org/guide/introduction.html",
  "Angular": "https://angular.io/tutorial",
  "GraphQL": "https://graphql.org/learn/",
  "REST API": "https://restfulapi.net/",
  "Microservices": "https://microservices.io/patterns/microservices.html",
  "DevOps": "https://www.atlassian.com/devops",
  "CI/CD": "https://www.redhat.com/en/topics/devops/what-is-ci-cd",
  "Agile": "https://www.atlassian.com/agile",
  "Scrum": "https://www.scrum.org/resources/what-scrum-module",
  "Testing": "https://www.guru99.com/software-testing.html",
  "Jest": "https://jestjs.io/docs/getting-started",
  "Cypress": "https://docs.cypress.io/guides/overview/why-cypress",
  "Selenium": "https://www.selenium.dev/documentation/",
  "default": "https://www.google.com/search?q="
};

const getSkillResource = (skill: string): string => {
  const normalizedSkill = skill.trim();
  return skillResources[normalizedSkill] || `${skillResources.default}${encodeURIComponent(normalizedSkill + " tutorial")}`;
};

const Index = () => {
  const { profile } = useProfile();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Calculate skill matches for each internship
  const getSkillMatch = (internshipSkills: string[]) => {
    if (!profile || !profile.skills || profile.skills.length === 0) return 0;
    if (!internshipSkills || internshipSkills.length === 0) return 0;
    
    const matches = internshipSkills.filter(skill => 
      profile.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.round((matches.length / internshipSkills.length) * 100);
  };

  // Filter internships based on search query and category
  const filterInternships = () => {
    let filtered = sampleInternships;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(internship => internship.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(internship => 
        internship.title.toLowerCase().includes(query) ||
        internship.company.toLowerCase().includes(query) ||
        internship.location.toLowerCase().includes(query) ||
        internship.skills.some(skill => skill.toLowerCase().includes(query)) ||
        internship.tags.some(tag => tag.toLowerCase().includes(query)) ||
        internship.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Get personalized recommendations
  const getPersonalizedInternships = () => {
    const filtered = filterInternships();
    return filtered
      .map(internship => ({
        ...internship,
        skillMatch: getSkillMatch(internship.skills)
      }))
      .sort((a, b) => b.skillMatch - a.skillMatch);
  };

  const personalizedInternships = getPersonalizedInternships();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout onSearch={handleSearch}>
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
        {profile && profile.skills && profile.skills.length > 0 && (
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
                  const missingSkills = (internship.skills || []).filter(skill => 
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
                          <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill) => (
                              <a
                                key={skill}
                                href={getSkillResource(skill)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                              >
                                <Badge 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1"
                                >
                                  {skill}
                                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Badge>
                              </a>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {searchQuery ? `Search Results (${personalizedInternships.length})` : 
               selectedCategory !== "all" ? `${selectedCategory} Internships (${personalizedInternships.length})` :
               profile.skills.length > 0 ? "Recommended for You" : "All Internships"}
            </h3>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics and Telecommunication">Electronics & Telecommunication</SelectItem>
                    <SelectItem value="Biomedical Engineering">Biomedical Engineering</SelectItem>
                    
                  </SelectContent>
                </Select>
              </div>
              {(searchQuery || selectedCategory !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="text-sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {personalizedInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                {...internship}
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
