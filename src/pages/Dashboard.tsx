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
  CheckCircle,
  TrendingUp,
  Award,
  Star,
  Building,
  Calendar
} from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Dashboard = () => {
  const perks = [
    {
      icon: Target,
      title: "Smart Matching Algorithm",
      description: "Our AI-powered system matches you with internships based on your academic background, skills, and career interests.",
      highlight: "95% success rate"
    },
    {
      icon: Shield,
      title: "College-Verified Opportunities",
      description: "Every internship is posted by verified companies and approved by your college administration for maximum trust.",
      highlight: "100% verified"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Preparation Resources",
      description: "Access interview tips, resume templates, and skill development resources to boost your chances.",
      highlight: "500+ resources"
    },
    {
      icon: Users,
      title: "Active College Community",
      description: "Connect with fellow students, share experiences, and get advice from seniors who've been there.",
      highlight: "10,000+ students"
    },
    {
      icon: Building,
      title: "Top Company Partnerships",
      description: "Access internships from leading companies that have partnered directly with your college.",
      highlight: "1000+ companies"
    },
    {
      icon: Calendar,
      title: "Real-time Application Tracking",
      description: "Track your applications, get instant updates, and never miss important deadlines.",
      highlight: "Live updates"
    }
  ];

  const quickStats = [
    { label: "Active Internships", value: "500+", icon: Target },
    { label: "Partner Companies", value: "1000+", icon: Building },
    { label: "Student Success Rate", value: "95%", icon: TrendingUp },
    { label: "College Partners", value: "200+", icon: Award }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <main className="flex-1 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-accent opacity-5 pointer-events-none"></div>
          
          <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div className="text-center mb-12">
              <Badge className="bg-gradient-primary text-primary-foreground mb-4">
                🎓 Welcome to InternSphere
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Your Gateway to Perfect 
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Internships</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                As a college-verified platform, we ensure you get access to the best internship opportunities 
                with complete trust and transparency.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {quickStats.map((stat, index) => (
                <Card key={index} className="text-center p-4 border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-2">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Platform Perks */}
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Why InternSphere is Perfect for College Students
                </h2>
                <p className="text-lg text-muted-foreground">
                  Designed specifically for college students with features that matter most
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {perks.map((perk, index) => (
                  <Card key={index} className="border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <perk.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {perk.highlight}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{perk.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {perk.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Success Stories Preview */}
            <section className="bg-card/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                Join Thousands of Successful Students
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">High Success Rate</h4>
                  <p className="text-sm text-muted-foreground">
                    95% of our students successfully secure internships through our platform
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground">
                    Every opportunity is vetted by your college administration
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Career Growth</h4>
                  <p className="text-sm text-muted-foreground">
                    Build real-world experience and kickstart your professional journey
                  </p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section>
              <Card className="border-2 shadow-2xl bg-gradient-primary">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                    Ready to Start Your Internship Journey?
                  </h2>
                  <p className="text-lg text-primary-foreground/90 mb-6">
                    Complete your profile and start discovering amazing opportunities today
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/discover">
                      <Button size="lg" variant="secondary" className="px-8 py-3">
                        Discover Internships
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button size="lg" variant="outline" className="px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                        Complete Profile
                        <Target className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;