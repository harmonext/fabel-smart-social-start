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
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()
        ]);

        const hasCompanyDetails = !!companyDetailsResult.data;
        const hasMarketingOnboarding = !!marketingOnboardingResult.data;

        // Both company details and marketing onboarding must be completed
        setIsCompleted(hasCompanyDetails && hasMarketingOnboarding);
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