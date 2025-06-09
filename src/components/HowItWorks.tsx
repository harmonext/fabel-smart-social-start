
const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Register and Connect",
      description: "Sign up for Fabel and securely connect your social media accounts in just a few clicks."
    },
    {
      step: "2", 
      title: "Build Your Profile",
      description: "Fill out a short survey about your business to help our AI understand your brand and goals."
    },
    {
      step: "3",
      title: "Get Your Personas",
      description: "Receive 3 unique marketing personas tailored to your target audience and business objectives."
    },
    {
      step: "4",
      title: "Generate Content",
      description: "Watch as our AI automatically creates engaging, persona-specific content for your social channels."
    },
    {
      step: "5",
      title: "Schedule & Manage",
      description: "Use our intuitive calendar to schedule posts and manage your entire social media strategy."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="text-fabel-primary">Fabel</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with AI-powered marketing in just 5 simple steps.
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
