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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text">Marketing Profile Setup</CardTitle>
          <CardDescription className="text-lg">
            Help us understand your business and marketing goals to create personalized content for you.
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedTabs.length} of {tabs.length} sections completed
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              {tabs.map((tab, index) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className={`text-xs ${completedTabs.includes(tab.id) ? 'bg-primary text-primary-foreground' : ''}`}
                  disabled={index > 0 && !completedTabs.includes(tabs[index - 1].id)}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => {
              const TabComponent = tab.component;
              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <TabComponent 
                    formData={formData} 
                    onInputChange={handleInputChange} 
                  />
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={getCurrentTabIndex() === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              {canGoNext && (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentTabValid}
                >
                  Next
                </Button>
              )}
              
              {canSubmit && (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentTabValid || isSaving}
                  className="gradient-fabel text-white"
                >
                  {isSaving ? "Saving..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingOnboardingForm;