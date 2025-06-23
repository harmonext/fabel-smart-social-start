
import { useState, useEffect } from "react";
import CompanyDetailsForm from "./CompanyDetailsForm";
import OnboardingForm from "./OnboardingForm";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<'company-details' | 'onboarding'>('company-details');
  const { isCompleted: companyDetailsCompleted, isLoading } = useCompanyDetails();

  useEffect(() => {
    if (!isLoading && companyDetailsCompleted) {
      setCurrentStep('onboarding');
    }
  }, [companyDetailsCompleted, isLoading]);

  const handleContinueToOnboarding = () => {
    setCurrentStep('onboarding');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {currentStep === 'company-details' ? (
        <CompanyDetailsForm onContinue={handleContinueToOnboarding} />
      ) : (
        <OnboardingForm />
      )}
    </div>
  );
};

export default OnboardingFlow;
