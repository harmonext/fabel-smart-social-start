
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
      console.log('Starting persona generation...');
      const { data, error } = await supabase.functions.invoke('generate-personas');

      if (error) {
        console.error('Error calling generate-personas function:', error);
        toast({
          title: "Service Unavailable",
          description: "The persona generation service is temporarily unavailable. Please try again later.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Function response:', data);

      if (data.error) {
        console.error('Error from generate-personas function:', data.error);
        toast({
          title: "Generation Error", 
          description: "Unable to generate personas at this time. Please try again later.",
          variant: "destructive"
        });
        return false;
      }

      if (data.personas && Array.isArray(data.personas)) {
        console.log('Setting personas:', data.personas);
        setPersonas(data.personas);
        toast({
          title: "Success",
          description: "Marketing personas have been generated successfully!",
        });
        return true;
      } else {
        console.error('Invalid response format:', data);
        toast({
          title: "Generation Error",
          description: "Received invalid data from persona generation service. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error generating personas:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the persona generation service. Please check your internet connection and try again.",
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
