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
      title: "AI-Powered Matching",
      description: "Get personalized internship recommendations based on your skills and interests"
    },
    {
      icon: Shield,
      title: "Verified Companies",
      description: "Only trusted and verified companies with legitimate internship opportunities"
    },
    {
      icon: BookOpen,
      title: "Interview Preparation",
      description: "Practice with AI-generated interview questions tailored to your field"
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and get recommendations for improvement"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with other interns and share experiences and tips"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant notifications about new opportunities and application deadlines"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Internships", icon: Rocket },
    { number: "10,000+", label: "Partner Companies", icon: Building },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "Support Available", icon: Shield }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineering Intern at TechCorp",
      content: "InternSphere helped me find the perfect internship that matched my React skills. The AI recommendations were spot-on!",
      rating: 5
    },
    {
      name: "Arjun Patel",
      role: "Data Science Intern at Analytics Pro",
      content: "The interview preparation feature was amazing. I felt confident and well-prepared for my interviews.",
      rating: 5
    },
    {
      name: "Sneha Reddy",
      role: "Marketing Intern at Brand Solutions",
      content: "Found my dream internship in just 2 weeks! The platform made the whole process so much easier.",
      rating: 5
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
              🚀 AI-Powered Internship Platform
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Internship</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of verified internship opportunities with AI-powered matching, 
            personalized recommendations, and comprehensive preparation tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/discover">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-xl px-8 py-4 text-lg">
                Start Exploring
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="lg" variant="outline" className="border-2 px-8 py-4 text-lg">
                Create Profile
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.number}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
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

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Hear from students who found their perfect internships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
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