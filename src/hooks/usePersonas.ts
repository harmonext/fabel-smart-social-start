
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Persona {
  name: string;
  description: string;
  demographics: string;
  painPoints: string;
  goals: string;
  preferredChannels: string;
  buyingMotivation: string;
  contentPreferences: string;
}

export const usePersonas = () => {
  const { toast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generatePersonas = async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-personas');

      if (error) {
        console.error('Error calling generate-personas function:', error);
        toast({
          title: "Error",
          description: "Failed to generate personas. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (data.error) {
        console.error('Error from generate-personas function:', data.error);
        
        // Handle specific error about incomplete profile
        if (data.error.includes('complete your company profile')) {
          toast({
            title: "Profile Incomplete", 
            description: data.error,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error", 
            description: data.error,
            variant: "destructive"
          });
        }
        return false;
      }

      if (data.personas && Array.isArray(data.personas)) {
        setPersonas(data.personas);
        toast({
          title: "Success",
          description: "Marketing personas have been generated successfully!",
        });
        return true;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating personas:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating personas.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    personas,
    isLoading,
    generatePersonas
  };
};
