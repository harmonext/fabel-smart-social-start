
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: "🎯",
      title: "Persona-Based Campaigns",
      description: "Create targeted marketing campaigns tailored to your specific customer personas for maximum engagement and conversion."
    },
    {
      icon: "✍️",
      title: "AI-Generated Content",
      description: "Let our AI create compelling social media posts, captions, and content that resonates with your audience automatically."
    },
    {
      icon: "📆",
      title: "Auto-Scheduling Calendar",
      description: "Plan and schedule your content weeks in advance with our intelligent calendar that optimizes posting times."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-fabel-secondary/5 to-fabel-accent/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to <span className="text-fabel-primary">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed specifically for small businesses to streamline their social media marketing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-fabel-secondary/20 hover:border-fabel-primary/30 hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
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
  );
};

export default Features;
