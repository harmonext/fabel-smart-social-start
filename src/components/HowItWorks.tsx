const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Get Set Up in Minutes",
      description: "Start strong with a quick setup that connects all your social channels in one place — so you can manage everything seamlessly without the tech headache."
    },
    {
      step: "2", 
      title: "Your Brand, Perfectly Understood",
      description: "Tell us a little about your business, and we'll tailor your marketing experience to your goals and voice — no more one-size-fits-all strategies."
    },
    {
      step: "3",
      title: "Know Exactly Who You're Talking To",
      description: "Gain clear insight into your ideal audience with personalized marketing personas that make targeting effortless and messaging more effective"
    },
    {
      step: "4",
      title: "Create Content That Actually Clicks",
      description: "Get fresh, ready-to-post content and captions customized for your audience — so you can stay consistent and engaging without spending hours brainstorming"
    },
    {
      step: "5",
      title: "Stay Organized. Stay Consistent.",
      description: "Plan and schedule your posts with ease using our simple calendar — keeping your brand active and your workflow stress-free."
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Marketing, Made Effortless
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fabel makes marketing simple and effective.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center mb-12 last:mb-0">
              <div className="flex-shrink-0 mr-8">
                <div className="w-16 h-16 bg-fabel-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.step}
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-fabel-secondary/20 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="absolute left-8 mt-16 w-0.5 h-12 bg-fabel-secondary/30 hidden md:block"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
