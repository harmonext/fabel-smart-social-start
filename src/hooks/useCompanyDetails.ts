
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CompanyDetailsData {
  company_name: string;
  company_industry: string;
  company_address: string;
  onboarded?: boolean;
}

export const useCompanyDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsData | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCompanyDetailsStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('company_details')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking company details status:', error);
        }

        if (data) {
          setCompanyDetails({
            company_name: data.company_name,
            company_industry: data.company_industry,
            company_address: data.company_address,
            onboarded: data.onboarded
          });
          setIsOnboarded(data.onboarded || false);
          setIsCompleted(true);
        } else {
          setIsCompleted(false);
        }
      } catch (error) {
        console.error('Error checking company details status:', error);
        setIsCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkCompanyDetailsStatus();
  }, [user]);

  const saveCompanyDetails = async (data: CompanyDetailsData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save company details.",
        variant: "destructive"
      });
      return false;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('company_details')
        .upsert({
          user_id: user.id,
          ...data
        });

      if (error) {
        console.error('Error saving company details:', error);
        toast({
          title: "Error",
          description: "Failed to save company details. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      setIsCompleted(true);
      setCompanyDetails(data);
      toast({
        title: "Success",
        description: "Company details have been saved successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error saving company details:', error);
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
    companyDetails,
    isOnboarded,
    saveCompanyDetails
  };
};
