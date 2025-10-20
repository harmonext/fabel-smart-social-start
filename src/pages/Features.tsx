import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Sparkles, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Features = () => {
  const features = [
    {
      icon: Target,
      emoji: "🎯",
      title: "Persona-Based Campaigns",
      description: "Create targeted marketing campaigns tailored to your specific customer personas for maximum engagement and conversion."
    },
    {
      icon: Sparkles,
      emoji: "✨",
      title: "Content That Connects",
      description: "Generate fresh, engaging posts that match your tone and keep your audience coming back."
    },
    {
      icon: Calendar,
      emoji: "📅",
      title: "Auto-Scheduling Calendar",
      description: "Plan and schedule your content weeks in advance with our intelligent calendar that optimizes posting times."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fabel-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background opacity-90" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Smarter Marketing Starts with Fabel
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Everything you need to create, plan, and post content that resonates.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group relative overflow-hidden border-2 hover:border-fabel-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-fabel-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="p-8 relative z-10">
                  <div className="mb-6 text-6xl">
                    {feature.emoji}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-fabel-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-fabel">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Ready to Elevate Your Marketing?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: "100ms" }}>
              Let Fabel handle the strategy while you focus on creativity.
            </p>
            
            <Button 
              asChild
              size="lg" 
              className="bg-white text-fabel-primary hover:bg-white/90 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <Link to="/signup">
                Try Fabel Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
