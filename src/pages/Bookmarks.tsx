import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import InternshipCard from "@/components/InternshipCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { sampleInternships } from "@/data/internships";

const Bookmarks = () => {
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const [bookmarkedInternships, setBookmarkedInternships] = useState<typeof sampleInternships>([]);
  const [filteredInternships, setFilteredInternships] = useState<typeof sampleInternships>([]);

  // Filter internships based on current bookmarked IDs
  useEffect(() => {
    const filtered = sampleInternships
      .filter(internship => bookmarkedIds.includes(internship.id))
      .map(internship => ({
        ...internship,
        bookmarkedAt: new Date() // You could store actual bookmark dates in the context if needed
      }));
    setBookmarkedInternships(filtered);
    setFilteredInternships(filtered);
  }, [bookmarkedIds]);

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

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredInternships(bookmarkedInternships);
      return;
    }
    
    const filtered = bookmarkedInternships.filter(internship =>
      internship.title.toLowerCase().includes(query.toLowerCase()) ||
      internship.company.toLowerCase().includes(query.toLowerCase()) ||
      internship.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
      internship.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredInternships(filtered);
  };

  return (
    <Layout onSearch={handleSearch}>
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
            {filteredInternships.length === 0 ? (
              bookmarkedInternships.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Start bookmarking internships from the Discover page to keep track of opportunities you're interested in.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/discover">Discover Internships</Link>
                  </Button>
                </CardContent>
              </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      No bookmarked internships match your search criteria.
                    </p>
                  </CardContent>
                </Card>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    {...internship}
                  />
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
                  <InternshipCard
                    key={internship.id}
                    {...internship}
                  />
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