import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MarketingOnboardingData {
  // Tab 1: About You
  name: string;
  title: string;
  
  // Tab 2: About Your Company
  company_name: string;
  category: string;
  stage: string;
  product_types: string[];
  store_type: string[];
  monthly_revenue: string;
  
  // Tab 3: About Your Goals
  goals: string[];
  
  // Tab 4: About Your Customer
  customer_gender: string[];
  customer_age_ranges: string[];
  customer_income_ranges: string[];
}

export const useMarketingOnboarding = () => {
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
        const { data, error } = await supabase
          .from('marketing_onboarding')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking marketing onboarding status:', error);
          setIsCompleted(false);
        } else {
          setIsCompleted(!!data);
        }
      } catch (error) {
        console.error('Error checking marketing onboarding status:', error);
        setIsCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const fetchOnboardingData = async (): Promise<MarketingOnboardingData | null> => {
    if (!user) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('marketing_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching marketing onboarding data:', error);
        return null;
      }

      if (data) {
        return {
          name: data.name,
          title: data.title,
          company_name: data.company_name,
          category: data.category,
          stage: data.stage,
          product_types: data.product_types,
          store_type: Array.isArray(data.store_type) ? data.store_type : [],
          monthly_revenue: data.monthly_revenue,
          goals: data.goals,
          customer_gender: data.customer_gender,
          customer_age_ranges: data.customer_age_ranges,
          customer_income_ranges: data.customer_income_ranges
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching marketing onboarding data:', error);
      return null;
    }
  };

  const saveOnboarding = async (data: MarketingOnboardingData): Promise<boolean> => {
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
        .from('marketing_onboarding')
        .upsert({
          user_id: user.id,
          ...data
        });

      if (error) {
        console.error('Error saving marketing onboarding:', error);
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
        description: "Your marketing profile has been saved successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error saving marketing onboarding:', error);
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