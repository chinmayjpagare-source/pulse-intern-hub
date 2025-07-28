import { MapPin, Clock, Calendar, DollarSign, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface InternshipCardProps {
  id: string;
  title: string;
  company: string;
  isVerified: boolean;
  location: string;
  mode: "Remote" | "On-site" | "Hybrid";
  duration: string;
  description: string;
  skills: string[];
  deadline: string;
  isPaid: boolean;
  stipend?: string;
  tags: string[];
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  skillMatch?: number;
}

const InternshipCard = ({
  title,
  company,
  isVerified,
  location,
  mode,
  duration,
  description,
  skills,
  deadline,
  isPaid,
  stipend,
  tags,
  isBookmarked = false,
  onBookmarkToggle,
  skillMatch,
}: InternshipCardProps) => {
  const getModeColor = (mode: string) => {
    switch (mode) {
      case "Remote":
        return "bg-green-100 text-green-800 border-green-200";
      case "Hybrid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 bg-card border border-border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-foreground font-medium">{company}</span>
              {isVerified && (
                <div className="ml-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {skillMatch !== undefined && (
              <Badge variant={skillMatch > 60 ? "default" : "secondary"} className="text-xs">
                {skillMatch}% match
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookmarkToggle}
              className={`transition-colors ${
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Location and Mode */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-medium ${getModeColor(mode)}`}
          >
            {mode}
          </Badge>
        </div>

        {/* Duration and Deadline */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Deadline: {deadline}
          </div>
        </div>

        {/* Stipend */}
        <div className="flex items-center mb-3">
          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm font-medium">
            {isPaid ? stipend : "Unpaid"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-accent/50 text-accent-foreground border-accent"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InternshipCard;