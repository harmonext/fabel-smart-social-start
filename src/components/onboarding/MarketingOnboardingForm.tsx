import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MarketingOnboardingData, useMarketingOnboarding } from "@/hooks/useMarketingOnboarding";
import { usePersonas } from "@/hooks/usePersonas";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { useAuth } from "@/contexts/AuthContext";
import AboutYouTab from "./marketing/AboutYouTab";
import AboutCompanyTab from "./marketing/AboutCompanyTab";
import AboutGoalsTab from "./marketing/AboutGoalsTab";
import AboutCustomerTab from "./marketing/AboutCustomerTab";

const MarketingOnboardingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveOnboarding, isSaving, fetchOnboardingData } = useMarketingOnboarding();
  const { generatePersonas } = usePersonas();
  const { isCompleted: onboardingCompleted } = useOnboarding();
  const { companyDetails } = useCompanyDetails();
  const [activeTab, setActiveTab] = useState("about-you");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<MarketingOnboardingData>({
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
    title: "",
    industry: companyDetails?.industry || "",
    product_types: [],
    store_type: [],
    goals: [],
    customer_gender: [],
    customer_age_ranges: [],
    customer_income_ranges: []
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);

  useEffect(() => {
    const loadExistingData = async () => {
      const existingData = await fetchOnboardingData();
      if (existingData) {
        setFormData(existingData);
        // Mark all tabs as completed if data exists
        setCompletedTabs(["about-you", "about-company", "about-goals", "about-customer"]);
      } else if (user || companyDetails) {
        // If no existing data but user/company details are available, pre-populate from available data
        setFormData(prev => ({
          ...prev,
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
          industry: companyDetails?.industry || ""
        }));
      }
      setIsLoadingData(false);
    };

    loadExistingData();
  }, [fetchOnboardingData, user, companyDetails]);

  const handleInputChange = (field: keyof MarketingOnboardingData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: "about-you", label: "About You", component: AboutYouTab, stepLabel: "You" },
    { id: "about-company", label: "About Your Company", component: AboutCompanyTab, stepLabel: "Company" },
    { id: "about-customer", label: "About Your Customer", component: AboutCustomerTab, stepLabel: "Customer" },
    { id: "about-goals", label: "About Your Goals", component: AboutGoalsTab, stepLabel: "Goals" }
  ];

  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const progress = ((completedTabs.length) / tabs.length) * 100;

  const validateCurrentTab = (): boolean => {
    switch (activeTab) {
      case "about-you":
        return formData.name.trim() !== "" && formData.title !== "";
      case "about-company":
        return formData.industry !== "" && 
               formData.product_types.length > 0 &&
               formData.store_type.length > 0;
      case "about-goals":
        return formData.goals.length > 0;
      case "about-customer":
        return formData.customer_gender.length > 0 &&
               formData.customer_age_ranges.length > 0 &&
               formData.customer_income_ranges.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs(prev => [...prev, activeTab]);
      }
      
      const currentIndex = getCurrentTabIndex();
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1].id);
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentTab()) {
      return;
    }

    const result = await saveOnboarding(formData);
    if (result.success && result.shouldGeneratePersonas) {
      setIsGeneratingPersonas(true);
      try {
        // Use the usePersonas hook which includes auto-saving functionality
        const success = await generatePersonas();
        if (success) {
          navigate('/dashboard?tab=company-profile&subtab=personas');
        } else {
          // Still navigate to personas page so user can manually generate
          navigate('/dashboard?tab=company-profile&subtab=personas');
        }
      } catch (error) {
        console.error('Error generating personas:', error);
        // Still navigate to personas page so user can manually generate
        navigate('/dashboard?tab=company-profile&subtab=personas');
      } finally {
        setIsGeneratingPersonas(false);
      }
    }
  };

  const isCurrentTabValid = validateCurrentTab();
  const isLastTab = getCurrentTabIndex() === tabs.length - 1;
  const canGoNext = isCurrentTabValid && !isLastTab;
  const canSubmit = isCurrentTabValid && isLastTab;

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

  if (isGeneratingPersonas) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F1EFEF' }}>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-sm" style={{ borderColor: '#abbdc6' }}>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Your Personas</h3>
              <p className="text-sm text-gray-600 text-center max-w-md">
                We're creating personalized customer personas based on your responses. This may take a few moments...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F1EFEF' }}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= getCurrentTabIndex() 
                        ? 'text-white' 
                        : 'text-gray-600'
                    }`}
                    style={{ 
                      backgroundColor: index <= getCurrentTabIndex() ? '#E3C38A' : '#BAC5C2'
                    }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 font-medium">
                    {tab.stepLabel}
                  </span>
                </div>
                {index < tabs.length - 1 && (
                  <div 
                    className={`w-16 h-0.5 mx-2`}
                    style={{ 
                      backgroundColor: index < getCurrentTabIndex() ? '#E3C38A' : '#abbdc6'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-sm" style={{ borderColor: '#abbdc6' }}>
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {tabs.map((tab) => {
                const TabComponent = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <TabComponent 
                      formData={formData} 
                      onInputChange={handleInputChange} 
                    />
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#abbdc6' }}>
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={getCurrentTabIndex() === 0}
                className="px-6 py-2 text-gray-600"
                style={{ 
                  borderColor: '#abbdc6', 
                  backgroundColor: 'transparent',
                  color: '#333'
                }}
              >
                Previous
              </Button>
              
              {canGoNext && (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentTabValid}
                  className="px-6 py-2 text-white border-0"
                  style={{ 
                    backgroundColor: '#E3C38A',
                    color: 'white'
                  }}
                >
                  Next
                </Button>
              )}
              
              {canSubmit && (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentTabValid || isSaving || onboardingCompleted}
                  className="px-6 py-2 text-white border-0"
                  style={{ 
                    backgroundColor: '#E3C38A',
                    color: 'white'
                  }}
                >
                  {onboardingCompleted ? "Already Completed" : isSaving ? "Saving..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingOnboardingForm;