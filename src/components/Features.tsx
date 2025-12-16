
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: "🎯",
      title: "Identify",
      description: "Define your businesses customer personas for maximum engagement."
    },
    {
      icon: "✍️",
      title: "Create",
      description: "Generate engaging content automatically tailored to your brand's voice and customer personas."
    },
    {
      icon: "📆",
      title: "Deploy & Optimize",
      description: "Deploy marketing campaigns across platforms automatically and optimize on findings, all in one place."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-fabel-secondary/5 to-fabel-accent/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Your Customer. Tell Your Story. Win Their Business.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Skip the spray-and-pray. Start marketing with purpose and results.
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
