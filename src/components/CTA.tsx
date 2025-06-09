
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 gradient-fabel">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Start Marketing Smarter Today
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Create your free account in minutes and start reaching the right customers with AI-powered content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-fabel-primary hover:bg-white/90 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-fabel-primary px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              Login
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
