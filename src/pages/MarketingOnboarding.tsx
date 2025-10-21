import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarketingOnboardingForm from "@/components/onboarding/MarketingOnboardingForm";
import { useOnboarding } from "@/hooks/useOnboarding";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const MarketingOnboarding = () => {
  const navigate = useNavigate();
  const { isCompleted, isLoading } = useOnboarding();

  useEffect(() => {
    // If user has already completed full onboarding, redirect to company dashboard
    if (!isLoading && isCompleted) {
      navigate('/dashboard?tab=company-profile&subtab=dashboard');
    }
  }, [isCompleted, isLoading, navigate]);

  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render the form if user is already completed (will be redirected)
  if (isCompleted) {
    return null;
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4 pt-24">
        <div className="container mx-auto py-8">
          <MarketingOnboardingForm />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MarketingOnboarding;