import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, Bookmark, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { staggerItemVariants } from "./StaggerContainer";

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
  skillMatch?: number;
  onApply?: () => void;
  pdfUrl?: string;
}

const InternshipCard = ({
  id,
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
  skillMatch,
  onApply,
  pdfUrl
}: InternshipCardProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const getModeColor = (mode: string) => {
    switch (mode) {
      case "Remote":
        return "bg-accent/10 text-accent border-accent/20";
      case "Hybrid":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  return (
    <motion.div variants={staggerItemVariants}>
      <Card className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-2 border-border hover:border-primary/20 overflow-hidden relative h-full">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />

        {/* Top accent line */}
        <div className="h-1 w-full bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="pb-3 relative">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-card-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">{company}</span>
                {isVerified && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-full border border-accent/20">
                    <div className="w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-accent-foreground text-[10px] font-bold">✓</span>
                    </div>
                    <span className="text-xs text-accent font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {skillMatch !== undefined && (
                <Badge 
                  variant={skillMatch > 60 ? "default" : "secondary"} 
                  className="text-xs font-semibold shadow-sm"
                >
                  {skillMatch}% match
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(id)}
                className={`transition-all duration-300 hover:scale-110 ${
                  isBookmarked(id)
                    ? "text-primary hover:text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked(id) ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 relative">
          {/* Location and Mode */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
              <MapPin className="h-4 w-4 mr-2 text-primary/60" />
              {location}
            </div>
            <Badge variant="outline" className={`text-xs font-semibold px-3 py-1 ${getModeColor(mode)}`}>
              {mode}
            </Badge>
          </div>

          {/* Duration and Deadline */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
              <Clock className="h-4 w-4 mr-2 text-primary/60" />
              {duration}
            </div>
            <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
              <Calendar className="h-4 w-4 mr-2 text-primary/60" />
              {deadline}
            </div>
          </div>

          {/* Stipend */}
          <div className="mb-4">
            <span className={`text-base font-bold ${isPaid ? "text-accent" : "text-muted-foreground"}`}>
              {isPaid ? stipend : "Unpaid"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Skills */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-3 py-1.5 font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex-col gap-4 relative">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 w-full">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-primary/5 text-primary border-primary/20 font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* View PDF Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => pdfUrl && window.open(pdfUrl, "_blank")}
            disabled={!pdfUrl}
            className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors disabled:opacity-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Details (PDF)
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default InternshipCard;
