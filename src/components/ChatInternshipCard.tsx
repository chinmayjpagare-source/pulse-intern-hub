import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, DollarSign, ExternalLink } from "lucide-react";

interface ChatInternshipCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: string;
  duration?: string;
  deadline?: string;
  stipend?: string;
  skills?: string[];
  applicationLink?: string;
}

const ChatInternshipCard = ({
  title,
  company,
  location,
  mode,
  duration,
  deadline,
  stipend,
  skills,
  applicationLink,
}: ChatInternshipCardProps) => {
  const getModeColor = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "remote":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "on-site":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "hybrid":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <Card className="my-2 border-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1">{title}</CardTitle>
            <p className="text-sm text-muted-foreground font-medium">{company}</p>
          </div>
          <Badge className={getModeColor(mode)}>{mode}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          {duration && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{duration}</span>
            </div>
          )}
          {deadline && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Deadline: {deadline}</span>
            </div>
          )}
          {stipend && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{stipend}</span>
            </div>
          )}
        </div>

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{skills.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {applicationLink && (
          <Button
            onClick={() => window.open(applicationLink, "_blank")}
            size="sm"
            className="w-full"
          >
            Apply Now
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatInternshipCard;
