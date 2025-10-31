import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  // Get context-aware search suggestions based on current page
  const getSearchSuggestions = (query: string) => {
    const currentPath = location.pathname;
    
    let keywords: string[] = [];
    
    switch (currentPath) {
      case '/discover':
        keywords = [
          "React", "Python", "JavaScript", "TechCorp Solutions", "AI Innovations Ltd", 
          "Bangalore", "Mumbai", "Delhi", "Full Stack Development", "Machine Learning",
          "Data Science", "Mobile Development", "Cybersecurity", "Web Development",
          "Node.js", "MongoDB", "AWS", "TensorFlow", "PyTorch", "Analytics Pro",
          "AppVenture Studio", "React Native", "Flutter", "Firebase", "SecureNet Systems",
          "Network Security", "Penetration Testing", "SIEM", "SmartTech Solutions",
          "Arduino", "Raspberry Pi", "IoT", "TeleCom Research Lab", "MATLAB",
          "Signal Processing", "DSP", "BioMed Innovations", "Medical Devices",
          "GeneTech Labs", "Bioinformatics", "Genomics", "DigitalCraft Inc",
          "HTML", "CSS", "DataVault Systems", "SQL", "Database", "Oracle", "PostgreSQL"
        ];
        break;
      case '/profile':
        keywords = [
          "Personal Information", "Academic Information", "Skills", "Resume",
          "Preferences", "Name", "Email", "Phone", "Location", "Degree",
          "University", "GPA", "Year of Study", "B.Tech", "M.Tech", "Engineering",
          "Work Mode", "Duration", "Remote", "On-site", "Hybrid"
        ];
        break;
      case '/preparation':
        keywords = [
          "HR Interview", "Technical Interview", "Behavioral Interview",
          "Mock Interview", "Interview Questions", "Practice", "Feedback",
          "Communication Skills", "Problem Solving", "Algorithms", "Data Structures",
          "System Design", "Coding Interview", "Soft Skills", "Leadership",
          "Teamwork", "Time Management", "Problem Solving"
        ];
        break;
      case '/bookmarks':
        keywords = [
          "Saved Internships", "Bookmarked", "Favorites", "Upcoming Deadlines",
          "Applied", "Interested", "TechCorp Solutions", "AI Innovations Ltd",
          "Analytics Pro", "BioMed Innovations", "SmartTech Solutions"
        ];
        break;
      case '/settings':
        keywords = [
          "Account Settings", "Security", "Notifications", "Appearance",
          "Password", "Two-Factor Authentication", "Email Notifications",
          "Push Notifications", "Dark Mode", "Light Mode", "Privacy",
          "Export Data", "Delete Account", "Profile Settings"
        ];
        break;
      default:
        keywords = [
          "React", "Python", "JavaScript", "TechCorp Solutions", "AI Innovations Ltd", 
          "Bangalore", "Mumbai", "Delhi", "Full Stack Development", "Machine Learning"
        ];
    }
    
    return keywords.filter(keyword => 
      keyword.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);

    if (query.trim()) {
      const suggestions = getSearchSuggestions(query).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
    // Only navigate to discover if not already there
    if (location.pathname !== '/discover' && location.pathname !== '/bookmarks') {
      navigate('/discover');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">IS</span>
          </div>
          <h1 className="text-xl font-bold text-primary">InternSphere</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder={
              location.pathname === '/profile' ? "Search profile settings..." :
              location.pathname === '/preparation' ? "Search interview topics..." :
              location.pathname === '/bookmarks' ? "Search bookmarked internships..." :
              location.pathname === '/settings' ? "Search settings..." :
              "Search internships, companies, or skills..."
            }
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-4 py-2 border-2 border-input focus:border-primary transition-colors rounded-xl bg-background shadow-sm"
          />
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-lg shadow-lg mt-1 z-50">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {profile.personalInfo.name || user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "Not logged in"}
              </p>
            </div>
            <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;