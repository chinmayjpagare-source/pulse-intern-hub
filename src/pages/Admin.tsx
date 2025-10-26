import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit } from "lucide-react";

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  application_url?: string;
  tags: string[];
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  const [internships, setInternships] = useState<Internship[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    salary_range: "",
    application_url: "",
    tags: ""
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchInternships();
    }
  }, [user, isAdmin]);

  const fetchInternships = async () => {
    const { data } = await supabase
      .from('internships')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setInternships(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const internshipData = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      salary_range: formData.salary_range || null,
      application_url: formData.application_url || null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      created_by: user?.id
    };

    if (editingId) {
      const { error } = await supabase
        .from('internships')
        .update(internshipData)
        .eq('id', editingId);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({ title: "Internship updated successfully!" });
        setEditingId(null);
        resetForm();
        fetchInternships();
      }
    } else {
      const { error } = await supabase
        .from('internships')
        .insert(internshipData);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({ title: "Internship created successfully!" });
        resetForm();
        fetchInternships();
      }
    }
  };

  const handleEdit = (internship: Internship) => {
    setFormData({
      title: internship.title,
      company: internship.company,
      location: internship.location,
      type: internship.type,
      description: internship.description,
      requirements: internship.requirements.join('\n'),
      salary_range: internship.salary_range || "",
      application_url: internship.application_url || "",
      tags: internship.tags.join(', ')
    });
    setEditingId(internship.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship?")) return;
    
    const { error } = await supabase
      .from('internships')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Internship deleted successfully!" });
      fetchInternships();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
      salary_range: "",
      application_url: "",
      tags: ""
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage internship listings</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList>
            <TabsTrigger value="create">
              {editingId ? "Edit" : "Create"} Internship
            </TabsTrigger>
            <TabsTrigger value="manage">Manage Internships</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? "Edit" : "Create New"} Internship</CardTitle>
                <CardDescription>
                  {editingId ? "Update" : "Add"} internship details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={formData.salary_range}
                        onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                        placeholder="$50,000 - $70,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">Application URL</Label>
                      <Input
                        id="url"
                        type="url"
                        value={formData.application_url}
                        onChange={(e) => setFormData({...formData, application_url: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      rows={4}
                      placeholder="Bachelor's degree&#10;2+ years experience&#10;..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="Tech, Remote, Full-time"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingId ? "Update" : "Create"} Internship
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="space-y-4">
              {internships.map((internship) => (
                <Card key={internship.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{internship.title}</CardTitle>
                        <CardDescription>
                          {internship.company} • {internship.location} • {internship.type}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(internship)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(internship.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {internship.description}
                    </p>
                    {internship.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {internship.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
