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
  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 pointer-events-none"></div>
      
      {/* Header */}
      <header className="absolute top-6 left-6 z-10">
        <Link to="/discover" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <span className="text-primary-foreground font-bold text-lg">IS</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">InternSphere</h1>
        </Link>
      </header>

      {/* Centered Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Badge className="bg-gradient-primary text-primary-foreground mb-6">
            🎓 College Internship Platform
          </Badge>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Find Your Perfect
          <span className="bg-gradient-primary bg-clip-text text-transparent"> Internship</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Connect with verified internship opportunities posted by companies and approved by your college administration.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" variant="outline" className="border-2 px-8 py-4 text-lg">
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-xl px-8 py-4 text-lg">
              Get Started
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;