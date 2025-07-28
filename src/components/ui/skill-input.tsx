import * as React from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SkillInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const SkillInput = React.forwardRef<HTMLDivElement, SkillInputProps>(
  ({ skills, onSkillsChange, placeholder = "Add a skill...", className }, ref) => {
    const [inputValue, setInputValue] = React.useState("");

    const addSkill = () => {
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !skills.includes(trimmedValue)) {
        onSkillsChange([...skills, trimmedValue]);
        setInputValue("");
      }
    };

    const removeSkill = (skillToRemove: string) => {
      onSkillsChange(skills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addSkill();
      }
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button onClick={addSkill} size="sm" disabled={!inputValue.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SkillInput.displayName = "SkillInput";