
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingData {
  business_name_description: string;
  customer_profile: string;
  customer_problem: string;
  unique_selling_proposition: string;
  social_media_goals: string[];
  content_tone: string;
  top_customer_questions: string;
  target_segments: string;
  customer_values: string;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check both company details and onboarding completion
        const [companyDetailsResult, onboardingResult] = await Promise.all([
          supabase
            .from('company_details')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('tenant_onboarding')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()
        ]);

        const hasCompanyDetails = !!companyDetailsResult.data;
        const hasOnboarding = !!onboardingResult.data;

        // Both must be completed for full onboarding completion
        setIsCompleted(hasCompanyDetails && hasOnboarding);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const fetchOnboardingData = async (): Promise<OnboardingData | null> => {
    if (!user) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('tenant_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding data:', error);
        return null;
      }

      if (data) {
        return {
          business_name_description: data.business_name_description,
          customer_profile: data.customer_profile,
          customer_problem: data.customer_problem,
          unique_selling_proposition: data.unique_selling_proposition,
          social_media_goals: data.social_media_goals,
          content_tone: data.content_tone,
          top_customer_questions: data.top_customer_questions,
          target_segments: data.target_segments,
          customer_values: data.customer_values
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      return null;
    }
  };

  const saveOnboarding = async (data: OnboardingData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save onboarding data.",
        variant: "destructive"
      });
      return false;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('tenant_onboarding')
        .upsert({
          user_id: user.id,
          ...data
        });

      if (error) {
        console.error('Error saving onboarding:', error);
        toast({
          title: "Error",
          description: "Failed to save your responses. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      setIsCompleted(true);
      toast({
        title: "Success",
        description: "Your responses have been saved. We'll use this information to create marketing personas and targeted content for you.",
      });
      return true;
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isCompleted,
    isLoading,
    isSaving,
    saveOnboarding,
    fetchOnboardingData
  };
};
