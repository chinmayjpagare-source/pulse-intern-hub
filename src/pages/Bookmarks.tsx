import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import InternshipCard from "@/components/InternshipCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, AlertTriangle } from "lucide-react";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { sampleInternships } from "@/data/internships";
import { supabase } from "@/integrations/supabase/client";

const Bookmarks = () => {
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const [bookmarkedInternships, setBookmarkedInternships] = useState<typeof sampleInternships>([]);
  const [filteredInternships, setFilteredInternships] = useState<typeof sampleInternships>([]);

  // Filter internships based on current bookmarked IDs
  useEffect(() => {
    const filtered = sampleInternships
      .filter(internship => bookmarkedIds.includes(internship.id));
    setBookmarkedInternships(filtered);
    setFilteredInternships(filtered);
  }, [bookmarkedIds]);


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
      </div>
    </Layout>
  );
};

export default Bookmarks;