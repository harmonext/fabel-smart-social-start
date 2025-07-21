import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MarketingOnboardingData {
  // Tab 1: About You
  name: string;
  title: string;
  
  // Tab 2: About Your Company
  category: string;
  product_types: string[];
  store_type: string[];
  
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
        // Helper function to parse array fields that might be stringified
        const parseArrayField = (field: any): string[] => {
          if (!field) return [];
          if (Array.isArray(field)) {
            // If it's an array, check if the first element is a stringified JSON
            if (field.length > 0 && typeof field[0] === 'string' && field[0].startsWith('[')) {
              try {
                return JSON.parse(field[0]);
              } catch {
                return field;
              }
            }
            return field;
          }
          if (typeof field === 'string') {
            try {
              return JSON.parse(field);
            } catch {
              return [field];
            }
          }
          return [];
        };

        return {
          name: data.name,
          title: data.title,
          category: data.category,
          product_types: parseArrayField(data.product_types),
          store_type: parseArrayField(data.store_type),
          goals: parseArrayField(data.goals),
          customer_gender: parseArrayField(data.customer_gender),
          customer_age_ranges: parseArrayField(data.customer_age_ranges),
          customer_income_ranges: parseArrayField(data.customer_income_ranges)
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching marketing onboarding data:', error);
      return null;
    }
  };

  const generatePersonaPrompt = (template: string, data: MarketingOnboardingData): string => {
    let prompt = template;
    
    // Replace template variables with actual values using marketing_onboarding prefix
    prompt = prompt.replace(/\{\{marketing_onboarding\.name\}\}/g, data.name);
    prompt = prompt.replace(/\{\{marketing_onboarding\.title\}\}/g, data.title);
    prompt = prompt.replace(/\{\{marketing_onboarding\.category\}\}/g, data.category);
    prompt = prompt.replace(/\{\{marketing_onboarding\.product_types\}\}/g, data.product_types.join(', '));
    prompt = prompt.replace(/\{\{marketing_onboarding\.store_type\}\}/g, data.store_type.join(', '));
    prompt = prompt.replace(/\{\{marketing_onboarding\.goals\}\}/g, data.goals.join(', '));
    prompt = prompt.replace(/\{\{marketing_onboarding\.customer_gender\}\}/g, data.customer_gender.join(', '));
    prompt = prompt.replace(/\{\{marketing_onboarding\.customer_age_ranges\}\}/g, data.customer_age_ranges.join(', '));
    prompt = prompt.replace(/\{\{marketing_onboarding\.customer_income_ranges\}\}/g, data.customer_income_ranges.join(', '));
    
    // Also support legacy format for backward compatibility
    prompt = prompt.replace(/\{\{name\}\}/g, data.name);
    prompt = prompt.replace(/\{\{title\}\}/g, data.title);
    prompt = prompt.replace(/\{\{category\}\}/g, data.category);
    prompt = prompt.replace(/\{\{product_types\}\}/g, data.product_types.join(', '));
    prompt = prompt.replace(/\{\{store_type\}\}/g, data.store_type.join(', '));
    prompt = prompt.replace(/\{\{goals\}\}/g, data.goals.join(', '));
    prompt = prompt.replace(/\{\{customer_gender\}\}/g, data.customer_gender.join(', '));
    prompt = prompt.replace(/\{\{customer_age_ranges\}\}/g, data.customer_age_ranges.join(', '));
    prompt = prompt.replace(/\{\{customer_income_ranges\}\}/g, data.customer_income_ranges.join(', '));
    
    return prompt;
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
      // Save marketing onboarding data
      const { error: onboardingError } = await supabase
        .from('marketing_onboarding')
        .upsert({
          user_id: user.id,
          ...data
        });

      if (onboardingError) {
        console.error('Error saving marketing onboarding:', onboardingError);
        toast({
          title: "Error",
          description: "Failed to save your responses. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Fetch the persona prompt template
      const { data: templateData, error: templateError } = await supabase
        .from('system_prompt_template')
        .select('value')
        .eq('name', 'persona_prompt')
        .maybeSingle();

      if (templateError) {
        console.error('Error fetching prompt template:', templateError);
        // Continue without updating persona prompt
      } else if (templateData) {
        // Generate the persona prompt using the template
        const generatedPrompt = generatePersonaPrompt(templateData.value, data);
        
        // Update the company details with the generated persona prompt
        const { error: companyError } = await supabase
          .from('company_details')
          .update({
            onboarding_persona_prompt: generatedPrompt
          })
          .eq('user_id', user.id);

        if (companyError) {
          console.error('Error updating company details:', companyError);
          // Continue without showing error to user as main onboarding was successful
        }
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