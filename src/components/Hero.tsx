
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-fabel opacity-10"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-fabel-primary rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-fabel-accent rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-fabel-secondary rounded-full opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            AI-Powered Marketing,{" "}
            <span className="text-fabel-primary">Made Simple</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Fabel helps small businesses grow by generating and scheduling 
            persona-based social content automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-fabel-primary hover:bg-fabel-primary/90 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              Sign Up Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-fabel-secondary text-fabel-secondary hover:bg-fabel-secondary hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              See How It Works
            </Button>
          </div>
          
          {/* App UI Preview Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-fabel-secondary/20">
              <div className="bg-gradient-to-br from-fabel-primary/10 to-fabel-accent/10 rounded-xl p-6 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-fabel-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  <p className="text-fabel-primary font-semibold">Fabel Dashboard Preview</p>
                  <p className="text-sm text-muted-foreground mt-2">AI-Generated Content • Persona Management • Scheduling Calendar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
