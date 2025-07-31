import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Target, 
  Zap, 
  Shield, 
  Users, 
  BookOpen,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  MapPin,
  Clock
} from "lucide-react";

const Landing = () => {
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
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-primary-foreground font-bold text-lg">IS</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">InternSphere</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/discover">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Discover Internships
              </Button>
            </Link>
            <Link to="/profile">
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-primary text-primary-foreground mb-4">
              🎓 College Internship Platform
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Internship</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with verified internship opportunities posted by companies and approved by your college administration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-xl px-8 py-4 text-lg">
                Discover Internships
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 px-8 py-4 text-lg">
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/profile">
              <Button size="lg" variant="ghost" className="px-8 py-4 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose InternSphere?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find, apply for, and land your dream internship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 shadow-2xl bg-gradient-primary">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-primary-foreground mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Join thousands of students who have found their perfect internships with InternSphere
              </p>
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
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-card border-t">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IS</span>
            </div>
            <span className="text-xl font-bold text-primary">InternSphere</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 InternSphere. All rights reserved. Empowering the next generation of professionals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;