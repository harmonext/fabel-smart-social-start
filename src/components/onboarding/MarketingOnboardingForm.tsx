import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MarketingOnboardingData, useMarketingOnboarding } from "@/hooks/useMarketingOnboarding";
import AboutYouTab from "./marketing/AboutYouTab";
import AboutCompanyTab from "./marketing/AboutCompanyTab";
import AboutGoalsTab from "./marketing/AboutGoalsTab";
import AboutCustomerTab from "./marketing/AboutCustomerTab";

const MarketingOnboardingForm = () => {
  const navigate = useNavigate();
  const { saveOnboarding, isSaving, fetchOnboardingData } = useMarketingOnboarding();
  const [activeTab, setActiveTab] = useState("about-you");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<MarketingOnboardingData>({
    name: "",
    title: "",
    company_name: "",
    category: "",
    stage: "",
    product_types: [],
    store_type: "",
    monthly_revenue: "",
    goals: [],
    customer_gender: "",
    customer_age_ranges: [],
    customer_income_ranges: []
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadExistingData = async () => {
      const existingData = await fetchOnboardingData();
      if (existingData) {
        setFormData(existingData);
        // Mark all tabs as completed if data exists
        setCompletedTabs(["about-you", "about-company", "about-goals", "about-customer"]);
      }
      setIsLoadingData(false);
    };

    loadExistingData();
  }, [fetchOnboardingData]);

  const handleInputChange = (field: keyof MarketingOnboardingData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: "about-you", label: "About You", component: AboutYouTab },
    { id: "about-company", label: "About Your Company", component: AboutCompanyTab },
    { id: "about-goals", label: "About Your Goals", component: AboutGoalsTab },
    { id: "about-customer", label: "About Your Customer", component: AboutCustomerTab }
  ];

  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const progress = ((completedTabs.length) / tabs.length) * 100;

  const validateCurrentTab = (): boolean => {
    switch (activeTab) {
      case "about-you":
        return formData.name.trim() !== "" && formData.title !== "";
      case "about-company":
        return formData.company_name.trim() !== "" && 
               formData.category !== "" && 
               formData.stage !== "" &&
               formData.product_types.length > 0 &&
               formData.store_type !== "" &&
               formData.monthly_revenue !== "";
      case "about-goals":
        return formData.goals.length > 0;
      case "about-customer":
        return formData.customer_gender !== "" &&
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

    const success = await saveOnboarding(formData);
    if (success) {
      navigate('/dashboard?tab=company-profile&subtab=personas');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= getCurrentTabIndex() 
                      ? 'bg-yellow-400 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < tabs.length - 1 && (
                  <div 
                    className={`w-16 h-0.5 mx-2 ${
                      index < getCurrentTabIndex() 
                        ? 'bg-yellow-400' 
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-sm border border-gray-200">
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
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={getCurrentTabIndex() === 0}
                className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Previous
              </Button>
              
              {canGoNext && (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentTabValid}
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white border-0"
                >
                  Next
                </Button>
              )}
              
              {canSubmit && (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentTabValid || isSaving}
                  className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white border-0"
                >
                  {isSaving ? "Saving..." : "Complete Setup"}
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