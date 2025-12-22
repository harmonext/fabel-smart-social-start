import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
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
import { supabase } from "@/integrations/supabase/client";
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

  useEffect(() => {
    console.log("Active tab:", activeTab);
  }, [activeTab]);
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const [formData, setFormData] = useState<MarketingOnboardingData>({
    name: "",
    title: "",
    industry: "",
    product_types: [],
    store_type: [],
    company_description: "",
    goals: [],
    customer_gender: [],
    customer_age_ranges: [],
    customer_income_ranges: [],
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);

  // Map Tabs → Step Numbers
  const tabToStepMap: Record<string, number> = {
    "about-you": 0,
    "about-company": 1,
    "about-customer": 2,
    "about-goals": 3,
  };

  // Load draft from form_drafts table
  const loadDraft = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    const { data, error } = await supabase
      .from("form_drafts")
      .select("current_step, form_data")
      .eq("form_id", "fabel_onboarding_v1")
      .eq("status", "draft")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading draft:", error);
      return false;
    }

    if (data) {
      // Restore the saved form step
      const stepMap: Record<number, string> = {
        0: "about-you",
        1: "about-company",
        2: "about-customer",
        3: "about-goals",
      };
      const tabId = stepMap[data.current_step] || "about-you";
      setActiveTab(tabId);

      // Restore the saved form values
      if (data.form_data && typeof data.form_data === "object" && !Array.isArray(data.form_data)) {
        setFormData(data.form_data as unknown as MarketingOnboardingData);
      }

      return true;
    }

    return false;
  }, [user]);

  // Create the Save-for-Later Function
  const saveDraft = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    const currentStep = tabToStepMap[activeTab] ?? 0;

    // Check if draft already exists
    const { data: existing } = await supabase
      .from("form_drafts")
      .select("id")
      .eq("form_id", "fabel_onboarding_v1")
      .eq("user_id", user.id)
      .maybeSingle();

    let error;
    if (existing) {
      // Update existing draft
      const result = await supabase
        .from("form_drafts")
        .update({
          current_step: currentStep,
          form_data: formData as unknown as Record<string, never>,
          status: "draft",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      error = result.error;
    } else {
      // Insert new draft
      const result = await supabase.from("form_drafts").insert([
        {
          form_id: "fabel_onboarding_v1",
          current_step: currentStep,
          form_data: formData as unknown as Record<string, never>,
          status: "draft",
        },
      ]);
      error = result.error;
    }

    if (error) {
      console.error("Error saving draft:", error);
      return false;
    }

    return true;
  }, [user, activeTab, formData]);

  // submit the onboarding
  const submitOnboarding = async (): Promise<boolean> => {
    if (!user) return false;

    // 1. (Optional but recommended)
    // Save one last time before submitting
    await saveDraft();

    // 2. Mark the draft as submitted
    const { error } = await supabase
      .from("form_drafts")
      .update({
        status: "submitted",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("form_id", "fabel_onboarding_v1")
      .eq("status", "draft");

    if (error) {
      console.error("Error submitting onboarding:", error);
      return false;
    }

    return true;
  };

  useEffect(() => {
    const loadExistingData = async () => {
      // First, try to load from draft (saved for later)
      const draftLoaded = await loadDraft();
      
      if (draftLoaded) {
        // Draft was loaded successfully, just finish loading
        setIsLoadingData(false);
        return;
      }

      // No draft, check for existing completed onboarding data
      const existingData = await fetchOnboardingData();
      if (existingData) {
        setFormData(existingData);
        // Mark all tabs as completed if data exists
        setCompletedTabs(["about-you", "about-company", "about-goals", "about-customer"]);
      } else {
        // Pre-populate from user and company data
        const formatUserName = () => {
          // Try full_name first (if it exists and has spaces)
          if (user?.user_metadata?.full_name && user.user_metadata.full_name.includes(" ")) {
            return user.user_metadata.full_name;
          }

          // Try combining first_name and last_name
          if (user?.user_metadata?.first_name || user?.user_metadata?.last_name) {
            const firstName = user.user_metadata.first_name || "";
            const lastName = user.user_metadata.last_name || "";
            return `${firstName} ${lastName}`.trim();
          }

          // Try name field (if it exists, try to add space intelligently)
          if (user?.user_metadata?.name) {
            const name = user.user_metadata.name;
            // If name has no spaces and is longer than 4 characters, try to split it
            if (!name.includes(" ") && name.length > 4) {
              // Simple heuristic: assume first name is first part, rest is last name
              // Find likely split point (after lowercase letter before uppercase, or at middle)
              const match = name.match(/^([a-z]+)([A-Z][a-z]*)/);
              if (match) {
                return `${match[1]} ${match[2]}`;
              }
              // Fallback: split roughly in middle
              const mid = Math.ceil(name.length / 2);
              return `${name.slice(0, mid)} ${name.slice(mid)}`;
            }
            return name;
          }

          // Fallback to email username
          return user?.email?.split("@")[0] || "";
        };
        setFormData((prev) => ({
          ...prev,
          name: formatUserName(),
          industry: prev.industry || companyDetails?.industry || "",
        }));
      }
      setIsLoadingData(false);
    };
    if (user) {
      loadExistingData();
    }
  }, [fetchOnboardingData, loadDraft, user, companyDetails]);
  const handleInputChange = (field: keyof MarketingOnboardingData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const tabs = [
    {
      id: "about-you",
      label: "About You",
      component: AboutYouTab,
      stepLabel: "You",
    },
    {
      id: "about-company",
      label: "About Your Company",
      component: AboutCompanyTab,
      stepLabel: "Company",
    },
    {
      id: "about-customer",
      label: "About Your Customer",
      component: AboutCustomerTab,
      stepLabel: "Customer",
    },
    {
      id: "about-goals",
      label: "About Your Goals",
      component: AboutGoalsTab,
      stepLabel: "Goals",
    },
  ];
  const getCurrentTabIndex = () => tabs.findIndex((tab) => tab.id === activeTab);
  const progress = (completedTabs.length / tabs.length) * 100;
  const validateCurrentTab = (): boolean => {
    switch (activeTab) {
      case "about-you":
        return formData.name.trim() !== "" && formData.title !== "";
      case "about-company":
        return formData.industry !== "" && formData.product_types.length > 0 && formData.store_type.length > 0;
      case "about-goals":
        return formData.goals.length > 0;
      case "about-customer":
        return (
          formData.customer_gender.length > 0 &&
          formData.customer_age_ranges.length > 0 &&
          formData.customer_income_ranges.length > 0
        );
      default:
        return false;
    }
  };
  const handleNext = () => {
    if (validateCurrentTab()) {
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs((prev) => [...prev, activeTab]);
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

    console.log("Submitting formData:", formData);

    // Save onboarding data (your existing function)
    const result = await saveOnboarding(formData);

    if (result.success) {
      // Mark the draft as submitted in form_drafts table
      const submitted = await submitOnboarding();
      if (!submitted) {
        toast.error("Failed to finalize onboarding. Please try again.");
        return; // stop further processing
      }

      if (result.shouldGeneratePersonas) {
        setIsGeneratingPersonas(true);
        try {
          // Use the usePersonas hook which includes auto-saving functionality
          await generatePersonas();
        } catch (error) {
          console.error("Error generating personas:", error);
        } finally {
          setIsGeneratingPersonas(false);
        }
      }

      // Always navigate to personas dashboard after completion
      navigate("/dashboard?tab=company-profile&subtab=personas", {
        replace: true,
      });
    } else {
      toast.error("Failed to save onboarding data. Please try again.");
    }
  };

  /*const handleSubmit = async () => {
    if (!validateCurrentTab()) {
      return;
    }
    console.log('Submitting formData:', formData);
    const result = await saveOnboarding(formData);
    if (result.success) {
      if (result.shouldGeneratePersonas) {
        setIsGeneratingPersonas(true);
        try {
          // Use the usePersonas hook which includes auto-saving functionality
          await generatePersonas();
        } catch (error) {
          console.error('Error generating personas:', error);
        } finally {
          setIsGeneratingPersonas(false);
        }
      }
      // Always navigate to personas dashboard after completion
      navigate('/dashboard?tab=company-profile&subtab=personas', {
        replace: true
      });
    }
  };*/
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
      <div
        className="min-h-screen py-8 px-4"
        style={{
          backgroundColor: "#F1EFEF",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <Card
            className="bg-white shadow-sm"
            style={{
              borderColor: "#abbdc6",
            }}
          >
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
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: "#F1EFEF",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= getCurrentTabIndex() ? "text-white" : "text-gray-600"}`}
                    style={{
                      backgroundColor: index <= getCurrentTabIndex() ? "#E3C38A" : "#BAC5C2",
                    }}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 font-medium">{tab.stepLabel}</span>
                </div>
                {index < tabs.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2`}
                    style={{
                      backgroundColor: index < getCurrentTabIndex() ? "#E3C38A" : "#abbdc6",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card
          className="bg-white shadow-sm"
          style={{
            borderColor: "#abbdc6",
          }}
        >
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {tabs.map((tab) => {
                const TabComponent = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <TabComponent formData={formData} onInputChange={handleInputChange} />
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Navigation Buttons */}
            <div
              className="flex justify-between mt-8 pt-6 border-t"
              style={{
                borderColor: "#abbdc6",
              }}
            >
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={getCurrentTabIndex() === 0}
                  style={{
                    borderColor: "#abbdc6",
                    backgroundColor: "transparent",
                    color: "#333",
                  }}
                  className="px-6 py-2 text-gray-600 bg-fabel-primary"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    const success = await saveDraft();
                    if (success) {
                      toast.success("Progress saved. You can come back anytime.");
                    }
                  }}
                  style={{
                    borderColor: "#abbdc6",
                    backgroundColor: "transparent",
                    color: "#333",
                  }}
                  className="px-6 py-2 text-gray-600 bg-fabel-neutral"
                >
                  Save for Later
                </Button>
              </div>

              {canGoNext && (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentTabValid}
                  className="px-6 py-2 text-white border-0"
                  style={{
                    backgroundColor: "#E3C38A",
                    color: "white",
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
                    backgroundColor: "#E3C38A",
                    color: "white",
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
