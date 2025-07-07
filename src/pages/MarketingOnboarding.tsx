import MarketingOnboardingForm from "@/components/onboarding/MarketingOnboardingForm";

const MarketingOnboarding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4">
      <div className="container mx-auto py-8">
        <MarketingOnboardingForm />
      </div>
    </div>
  );
};

export default MarketingOnboarding;