import * as React from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string;
  maxSize?: number;
  currentFile?: File | null;
  className?: string;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onFileSelect, acceptedTypes = ".pdf,.doc,.docx", maxSize = 5 * 1024 * 1024, currentFile, className }, ref) => {
    const [dragActive, setDragActive] = React.useState(false);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        validateAndSelectFile(files[0]);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        validateAndSelectFile(files[0]);
      }
    };

    const validateAndSelectFile = (file: File) => {
      if (file.size > maxSize) {
        alert("File size too large. Maximum size is 5MB.");
        return;
      }
      onFileSelect(file);
    };

    const removeFile = () => {
      onFileSelect(null);
    };

    if (currentFile) {
      return (
        <div className={cn("flex items-center justify-between p-4 border border-border rounded-lg bg-muted", className)}>
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate">{currentFile.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors",
          dragActive && "border-primary bg-primary/5",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={ref}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-foreground mb-1">
          Drop your resume here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PDF, DOC, DOCX (max 5MB)
        </p>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";