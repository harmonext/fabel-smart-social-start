
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const Hero = () => {
  const { user, loading } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Brand", "Business", "Audience", "Impact", "Legacy"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  console.log('Hero component - User state:', user?.email || 'no user', 'Loading:', loading);

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">The Smarter Way to Grow Your </span>
            <span className="relative inline-block min-w-[280px] md:min-w-[400px] align-baseline -translate-y-[60px]">
              {words.map((word, index) => (
                <span
                  key={word}
                  className={`absolute left-0 right-0 gradient-text px-4 py-2 rounded-lg transition-all duration-500 ${
                    index === currentWordIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ backgroundColor: 'hsl(var(--fabel-primary) / 1.2)' }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Create compelling content, reach your ideal customers, and grow your business with personalized marketing that adapts to your brand voice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild
              size="lg" 
              className="gradient-fabel text-white hover:opacity-90 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Link to="/signup">
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
              onClick={scrollToHowItWorks}
            >
              <Play className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            No credit card required • Start creating in minutes
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
