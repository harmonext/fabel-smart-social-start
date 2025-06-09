
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Founder, Bloom Bakery",
      content: "Fabel transformed our social media presence! We went from posting sporadically to having a consistent, engaging content strategy. Our customer engagement increased by 300% in just two months.",
      avatar: "SJ"
    },
    {
      name: "Marcus Chen", 
      role: "Marketing Manager, TechStart Solutions",
      content: "As a small tech company, we needed cost-effective marketing that actually worked. Fabel's AI-generated content feels authentic and has helped us reach customers we never knew existed.",
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Owner, Wellness Studio",
      content: "The persona-based approach is genius! Fabel helps us speak directly to busy professionals, wellness beginners, and fitness enthusiasts with tailored content for each group.",
      avatar: "ER"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from real businesses using Fabel to grow their social media presence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-fabel-secondary/20 hover:border-fabel-primary/30 hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fabel-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
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

export default Testimonials;
