import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check both company details and marketing onboarding completion
        const [companyDetailsResult, marketingOnboardingResult] = await Promise.all([
          supabase
            .from('company_details')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('marketing_onboarding')
            .select('id, current_tab')
            .eq('user_id', user.id)
            .maybeSingle()
        ]);

        const hasCompanyDetails = !!companyDetailsResult.data;
        const hasMarketingOnboarding = !!marketingOnboardingResult.data;
        
        // Marketing onboarding is only complete if current_tab is null (finished)
        const marketingOnboardingComplete = hasMarketingOnboarding && 
          marketingOnboardingResult.data?.current_tab === null;

        // Both company details and marketing onboarding must be completed
        setIsCompleted(hasCompanyDetails && marketingOnboardingComplete);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  return {
    isCompleted,
    isLoading
  };
};