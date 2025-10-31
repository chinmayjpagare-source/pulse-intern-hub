import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PDFUploadCardProps {
  internshipId: string;
  internshipTitle: string;
  currentPdfUrl?: string;
  onPdfUploaded: (url: string) => void;
}

export const PDFUploadCard = ({ 
  internshipId, 
  internshipTitle, 
  currentPdfUrl,
  onPdfUploaded 
}: PDFUploadCardProps) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "PDF must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create a unique filename
      const fileExt = "pdf";
      const fileName = `${internshipId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("internship-pdfs")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("internship-pdfs")
        .getPublicUrl(filePath);

      onPdfUploaded(publicUrl);

      toast({
        title: "Success",
        description: "PDF uploaded successfully!",
      });
    } catch (error: any) {
      console.error("Error uploading PDF:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!currentPdfUrl) return;

    setDeleting(true);
    try {
      // Extract filename from URL
      const urlParts = currentPdfUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];

      // Delete the file
      const { error } = await supabase.storage
        .from("internship-pdfs")
        .remove([fileName]);

      if (error) throw error;

      onPdfUploaded("");

      toast({
        title: "Success",
        description: "PDF deleted successfully!",
      });
    } catch (error: any) {
      console.error("Error deleting PDF:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5" />
          {internshipTitle}
        </CardTitle>
        <CardDescription>ID: {internshipId}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPdfUrl ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1 truncate">PDF uploaded</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(currentPdfUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Deleting..." : "Delete PDF"}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={`pdf-${internshipId}`}>Upload Internship Details PDF</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`pdf-${internshipId}`}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
              />
              <Button disabled={uploading} size="sm" variant="secondary">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
