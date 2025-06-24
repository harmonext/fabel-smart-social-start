import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingData, useOnboarding } from "@/hooks/useOnboarding";
import BusinessInfoSection from "./sections/BusinessInfoSection";
import CustomerInfoSection from "./sections/CustomerInfoSection";
import SocialMediaSection from "./sections/SocialMediaSection";
import AdditionalInfoSection from "./sections/AdditionalInfoSection";

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { saveOnboarding, isSaving, fetchOnboardingData } = useOnboarding();
  const [formData, setFormData] = useState<OnboardingData>({
    business_name_description: "",
    customer_profile: "",
    customer_problem: "",
    unique_selling_proposition: "",
    social_media_goals: [],
    content_tone: "",
    top_customer_questions: "",
    target_segments: "",
    customer_values: ""
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadExistingData = async () => {
      const existingData = await fetchOnboardingData();
      if (existingData) {
        setFormData(existingData);
      }
      setIsLoadingData(false);
    };

    loadExistingData();
  }, [fetchOnboardingData]);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field: 'social_media_goals', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'business_name_description',
      'customer_profile', 
      'customer_problem',
      'unique_selling_proposition',
      'content_tone',
      'top_customer_questions',
      'target_segments',
      'customer_values'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof OnboardingData] || (formData[field as keyof OnboardingData] as string).trim() === '') {
        return false;
      }
    }

    if (formData.social_media_goals.length === 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await saveOnboarding(formData);
    if (success) {
      // Redirect to dashboard with Personas tab active
      navigate('/dashboard?tab=company-profile&subtab=personas');
    }
  };

  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading your onboarding data...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text">Company Onboarding</CardTitle>
          <CardDescription className="text-lg">
            Help us understand your business so we can create personalized marketing content for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <BusinessInfoSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <CustomerInfoSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <SocialMediaSection 
              formData={formData} 
              onInputChange={handleInputChange}
              onMultiSelectChange={handleMultiSelectChange}
            />
            
            <AdditionalInfoSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full gradient-fabel text-white py-3 text-lg"
                disabled={isSaving || !validateForm()}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
