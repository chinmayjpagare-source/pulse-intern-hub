import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Shield, 
  Users, 
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Main = () => {
  const features = [
    {
      icon: Target,
      title: "Smart Matching",
      description: "Find internships that match your academic background and career interests"
    },
    {
      icon: Shield,
      title: "Verified Opportunities",
      description: "All internships are posted by verified companies and approved by college administration"
    },
    {
      icon: BookOpen,
      title: "Interview Preparation",
      description: "Access resources and tips to prepare for your internship interviews"
    },
    {
      icon: Users,
      title: "College Community",
      description: "Connect with fellow students and share internship experiences"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <main className="flex-1 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-accent opacity-5 pointer-events-none"></div>
          
          <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-16">
            {/* Features Section */}
            <section>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Why Choose InternSphere?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to find, apply for, and land your dream internship
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* How It Works Section */}
            <section>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-muted-foreground">
                  Get started in just 3 simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-2xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
                  <p className="text-muted-foreground">
                    Add your skills, interests, and preferences to get personalized recommendations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-2xl font-bold text-primary-foreground">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Discover Opportunities</h3>
                  <p className="text-muted-foreground">
                    Browse AI-curated internships that match your skills and career goals
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-2xl font-bold text-primary-foreground">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Apply & Succeed</h3>
                  <p className="text-muted-foreground">
                    Use our preparation tools and apply with confidence to land your dream internship
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section>
              <div className="max-w-4xl mx-auto text-center">
                <Card className="border-2 shadow-2xl bg-gradient-primary">
                  <CardContent className="p-12">
                    <h2 className="text-4xl font-bold text-primary-foreground mb-4">
                      Ready to Start Your Journey?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/discover">
                        <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                          Explore Internships
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link to="/profile">
                        <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                          Create Profile
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Main;