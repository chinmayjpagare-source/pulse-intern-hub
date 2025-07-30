import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import InternshipCard from "@/components/InternshipCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Calendar, Clock, AlertTriangle } from "lucide-react";

const sampleBookmarkedInternships = [
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
    bookmarkedAt: new Date("2024-01-05"),
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
    bookmarkedAt: new Date("2024-01-08"),
  },
  {
    id: "7",
    title: "Frontend Developer",
    company: "WebCraft Solutions",
    isVerified: true,
    location: "Delhi, India",
    mode: "Remote" as const,
    duration: "3 months",
    description: "Create responsive and interactive user interfaces using modern web technologies.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    deadline: "Jan 15, 2024",
    isPaid: true,
    stipend: "₹14,000/month",
    tags: ["Frontend", "React", "Web Development"],
    bookmarkedAt: new Date("2024-01-10"),
  },
];

const Bookmarks = () => {
  const [bookmarkedInternships, setBookmarkedInternships] = useState(sampleBookmarkedInternships);

  const removeBookmark = (id: string) => {
    setBookmarkedInternships(prev => prev.filter(internship => internship.id !== id));
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingDeadlines = bookmarkedInternships
    .map(internship => ({
      ...internship,
      daysUntilDeadline: getDaysUntilDeadline(internship.deadline)
    }))
    .filter(internship => internship.daysUntilDeadline <= 7 && internship.daysUntilDeadline >= 0)
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);

  const getDeadlineVariant = (days: number) => {
    if (days <= 2) return "destructive";
    if (days <= 5) return "secondary";
    return "outline";
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookmarks</h1>
          <p className="text-muted-foreground">
            Manage your saved internships and track upcoming deadlines
          </p>
        </div>

        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Saved Internships ({bookmarkedInternships.length})
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming Deadlines ({upcomingDeadlines.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            {bookmarkedInternships.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Start bookmarking internships from the Discover page to keep track of opportunities you're interested in.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/">Discover Internships</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookmarkedInternships.map((internship) => (
                  <div key={internship.id} className="relative">
                    <InternshipCard
                      {...internship}
                      isBookmarked={true}
                      onBookmarkToggle={() => removeBookmark(internship.id)}
                    />
                    <div className="absolute top-4 left-4 bg-background border rounded-lg px-2 py-1">
                      <span className="text-xs text-muted-foreground">
                        Saved {internship.bookmarkedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
            {upcomingDeadlines.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Deadlines</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You don't have any application deadlines approaching within the next 7 days.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Urgent: Apply Soon!
                    </CardTitle>
                    <CardDescription>
                      These internships have deadlines within the next 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingDeadlines.map((internship) => (
                        <div key={internship.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold">{internship.title}</h4>
                            <p className="text-sm text-muted-foreground">{internship.company}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {internship.mode}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {internship.location}
                              </Badge>
                              {internship.isPaid && (
                                <Badge variant="outline" className="text-xs">
                                  {internship.stipend}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Badge variant={getDeadlineVariant(internship.daysUntilDeadline)}>
                                {internship.daysUntilDeadline === 0 
                                  ? "Today!" 
                                  : internship.daysUntilDeadline === 1 
                                    ? "Tomorrow" 
                                    : `${internship.daysUntilDeadline} days`
                                }
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {internship.deadline}
                              </p>
                            </div>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Full cards view for upcoming deadlines */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {upcomingDeadlines.map((internship) => (
                    <div key={internship.id} className="relative">
                      <InternshipCard
                        {...internship}
                        isBookmarked={true}
                        onBookmarkToggle={() => removeBookmark(internship.id)}
                      />
                      <div className="absolute top-4 right-4 bg-orange-100 border border-orange-200 rounded-lg px-2 py-1">
                        <span className="text-xs text-orange-800 font-medium">
                          {internship.daysUntilDeadline === 0 
                            ? "Due Today" 
                            : `${internship.daysUntilDeadline}d left`
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Bookmarks;