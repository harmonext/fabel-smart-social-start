
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();

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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            AI-Powered Marketing That Actually Works
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Create compelling content, reach your ideal customers, and grow your business with personalized AI marketing that adapts to your brand voice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild
              size="lg" 
              className="gradient-fabel text-white hover:opacity-90 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Link to={user ? "/dashboard" : "/signup"}>
                {user ? "Go to Dashboard" : "Sign Up Free"}
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
