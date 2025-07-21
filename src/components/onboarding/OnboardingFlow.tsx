
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
    <div className="p-6">
      <CompanyDetailsForm onContinue={handleContinueToOnboarding} />
    </div>
  );
};

export default OnboardingFlow;
