
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyDetailsForm from "./CompanyDetailsForm";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { isCompleted: companyDetailsCompleted, isLoading } = useCompanyDetails();

  useEffect(() => {
    if (!isLoading && companyDetailsCompleted) {
      navigate('/marketing-onboarding');
    }
  }, [companyDetailsCompleted, isLoading, navigate]);

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
