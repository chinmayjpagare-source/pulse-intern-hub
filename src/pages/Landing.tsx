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
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 p-6 animate-fade-in">
        <Link to="/discover" className="flex items-center space-x-3 group w-fit">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="text-primary-foreground font-bold text-xl">IS</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">InternSphere</h1>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8 animate-scale-in">
            <Badge className="bg-white/20 backdrop-blur-sm border border-white/30 text-primary-foreground px-6 py-2 text-base mb-6 shadow-glow">
              🎓 #1 College Internship Platform
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-extrabold mb-8 leading-tight animate-slide-in-up">
            <span className="text-white drop-shadow-lg">Find Your</span>
            <br />
            <span className="bg-white bg-clip-text text-transparent drop-shadow-2xl">Dream Internship</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in drop-shadow-md" style={{ animationDelay: '0.2s' }}>
            Connect with <span className="font-semibold text-white">verified opportunities</span> from top companies, 
            trusted by <span className="font-semibold text-white">200+ colleges</span> nationwide
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-2xl px-10 py-6 text-lg font-semibold group transition-all duration-300 hover:scale-105">
                Get Started Free
                <Rocket className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-10 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105">
                Sign In
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[
              { icon: Users, label: 'Active Students', value: '10,000+' },
              { icon: Building, label: 'Companies', value: '1,000+' },
              { icon: Award, label: 'Success Rate', value: '95%' },
              { icon: Target, label: 'Internships', value: '500+' }
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl group hover:scale-105 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-white mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Landing;