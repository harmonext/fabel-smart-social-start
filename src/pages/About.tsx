import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Users, Calendar, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const scrollToMission = () => {
    const missionSection = document.getElementById('mission');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Sparkles,
      emoji: "✨",
      title: "AI-Generated Content",
      description: "Create compelling, brand-aligned content in seconds with advanced AI"
    },
    {
      icon: Users,
      emoji: "👥",
      title: "Persona-Driven Marketing",
      description: "Target the right audience with detailed customer personas"
    },
    {
      icon: Calendar,
      emoji: "📅",
      title: "Smart Social Scheduling",
      description: "Plan and automate your content across all platforms"
    },
    {
      icon: Zap,
      emoji: "⚡",
      title: "Collaboration Tools",
      description: "Work seamlessly with your team in one unified workspace"
    }
  ];

  const audiences = [
    {
      title: "Solopreneurs",
      description: "Built for independent creators who want to grow their brand efficiently"
    },
    {
      title: "Marketing Teams",
      description: "Empower your team to collaborate and create consistently"
    },
    {
      title: "Agencies",
      description: "Scale your client work with AI-powered content generation"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background opacity-90" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Empowering Creators and Teams to Market Smarter
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Fabel helps you create, plan, and post AI-generated content that aligns with your brand and audience.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              At Fabel, we believe in turning creative ideas into powerful stories. Our AI helps you stay consistent, strategic, and inspired — without burnout.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and optimize your marketing content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in border-muted"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 text-6xl">
                    {feature.emoji}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Who We Serve</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for every level of creator
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {audiences.map((audience, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 animate-fade-in border-muted"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-3 gradient-text">{audience.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 gradient-fabel">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to create your first campaign?
            </h2>
            <Button 
              asChild
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Link to="/signup">
                Get Started Free
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

export default About;
