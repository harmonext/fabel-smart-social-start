
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyDetailsForm from "./CompanyDetailsForm";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { useOnboarding } from "@/hooks/useOnboarding";

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { isCompleted: companyDetailsCompleted, isLoading } = useCompanyDetails();
  const { isCompleted: fullOnboardingCompleted } = useOnboarding();

  useEffect(() => {
    // Only redirect to marketing-onboarding if company details are completed 
    // but full onboarding is not yet completed
    if (!isLoading && companyDetailsCompleted && !fullOnboardingCompleted) {
      navigate('/marketing-onboarding');
    }
  }, [companyDetailsCompleted, isLoading, navigate, fullOnboardingCompleted]);

  const handleContinueToOnboarding = () => {
    navigate('/marketing-onboarding');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-fabel-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Fabel</span>
          </div>
        </div>
        <CompanyDetailsForm onContinue={handleContinueToOnboarding} />
      </div>
    </div>
  );
};

export default OnboardingFlow;
