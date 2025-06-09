
import { Card, CardContent } from "@/components/ui/card";

const Benefits = () => {
  const benefits = [
    {
      title: "Save Time on Content Creation",
      description: "Stop spending hours brainstorming posts. Our AI generates engaging content in seconds, giving you time to focus on growing your business.",
      icon: "⏰"
    },
    {
      title: "Deliver Smarter, Targeted Messaging", 
      description: "Reach the right customers with persona-based content that speaks directly to their needs and interests.",
      icon: "🎯"
    },
    {
      title: "Boost Social Media Engagement",
      description: "Increase likes, comments, and shares with AI-optimized content designed to drive meaningful interactions.",
      icon: "📈"
    },
    {
      title: "Manage Everything in One Dashboard",
      description: "Streamline your entire social media workflow with our comprehensive platform that handles everything from creation to scheduling.",
      icon: "🎛️"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-fabel-accent/5 to-fabel-neutral/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-fabel-primary">Fabel</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of small businesses who are already growing faster with AI-powered marketing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-fabel-secondary/20 hover:border-fabel-primary/30"
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
