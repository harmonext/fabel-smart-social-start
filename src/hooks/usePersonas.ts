
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Persona {
  name: string;
  description: string;
  location: string;
  psychographics: string;
  age_ranges: string;
  genders: string;
  top_competitors: string;
  social_media_top_1: string;
  social_media_top_2?: string;
  social_media_top_3?: string;
  cac_estimate?: number;
  ltv_estimate?: number;
  appeal_howto: string;
}

export const usePersonas = () => {
  const { toast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [rawPersonaData, setRawPersonaData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved personas on mount
  useEffect(() => {
    loadSavedPersonas();
  }, []);

  const loadSavedPersonas = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_personas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading saved personas:', error);
        return;
      }

      if (data && data.length > 0) {
        const loadedPersonas = data.map(persona => ({
          name: persona.name,
          description: persona.description,
          location: persona.location || '',
          psychographics: persona.psychographics || '',
          age_ranges: persona.age_ranges || '',
          genders: persona.genders || '',
          top_competitors: persona.top_competitors || '',
          social_media_top_1: persona.social_media_top_1 || '',
          social_media_top_2: persona.social_media_top_2,
          social_media_top_3: persona.social_media_top_3,
          cac_estimate: persona.cac_estimate,
          ltv_estimate: persona.ltv_estimate,
          appeal_howto: persona.appeal_howto || '',
        }));
        setPersonas(loadedPersonas);
      }
    } catch (error) {
      console.error('Error loading saved personas:', error);
    }
  };

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
        
        // Store the raw JSON response
        const rawJson = JSON.stringify(data);
        setRawPersonaData(rawJson);
        
        // Map AI response fields to our interface
        const mappedPersonas = data.personas.map((persona: any) => ({
          name: persona.name || '',
          description: persona.description || '',
          location: persona.location || '',
          psychographics: persona.psychographics || persona.demographics || '',
          age_ranges: persona.age_ranges || '',
          genders: persona.genders || '',
          top_competitors: persona.top_competitors || '',
          social_media_top_1: persona.social_media_top_1 || persona.preferredChannels?.split(',')[0]?.trim() || '',
          social_media_top_2: persona.social_media_top_2 || persona.preferredChannels?.split(',')[1]?.trim() || null,
          social_media_top_3: persona.social_media_top_3 || persona.preferredChannels?.split(',')[2]?.trim() || null,
          cac_estimate: persona.cac_estimate || persona.cacEstimate,
          ltv_estimate: persona.ltv_estimate || persona.ltvEstimate,
          appeal_howto: persona.appeal_howto || persona.appealHowto || '',
        }));
        setPersonas(mappedPersonas);
        
        // Auto-save the generated personas to the database
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (!userError && user) {
            // Delete existing saved personas for this user
            await supabase
              .from('saved_personas')
              .delete()
              .eq('user_id', user.id);

            // Insert the new personas
            const personasToSave = mappedPersonas.map(persona => ({
              name: persona.name,
              description: persona.description,
              location: persona.location,
              psychographics: persona.psychographics,
              age_ranges: persona.age_ranges,
              genders: persona.genders,
              top_competitors: persona.top_competitors,
              social_media_top_1: persona.social_media_top_1,
              social_media_top_2: persona.social_media_top_2,
              social_media_top_3: persona.social_media_top_3,
              cac_estimate: persona.cac_estimate,
              ltv_estimate: persona.ltv_estimate,
              appeal_howto: persona.appeal_howto,
              raw_persona_generated: rawJson,
              user_id: user.id,
            }));

            const { error: insertError } = await supabase
              .from('saved_personas')
              .insert(personasToSave);

            if (!insertError) {
              console.log('Personas auto-saved successfully');
            }
          }
        } catch (error) {
          console.error('Error auto-saving personas:', error);
        }
        
        toast({
          title: "Success",
          description: "Marketing personas have been generated and saved successfully!",
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

  const savePersonas = async (): Promise<boolean> => {
    if (personas.length === 0) {
      toast({
        title: "No Personas to Save",
        description: "Please generate personas first before saving.",
        variant: "destructive"
      });
      return false;
    }

    setIsSaving(true);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        toast({
          title: "Authentication Error",
          description: "You must be logged in to save personas.",
          variant: "destructive"
        });
        return false;
      }

      // First, delete existing saved personas for this user
      const { error: deleteError } = await supabase
        .from('saved_personas')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting existing personas:', deleteError);
      }

      // Then insert the new personas
      const personasToSave = personas.map(persona => ({
        name: persona.name,
        description: persona.description,
        location: persona.location,
        psychographics: persona.psychographics,
        age_ranges: persona.age_ranges,
        genders: persona.genders,
        top_competitors: persona.top_competitors,
        social_media_top_1: persona.social_media_top_1,
        social_media_top_2: persona.social_media_top_2,
        social_media_top_3: persona.social_media_top_3,
        cac_estimate: persona.cac_estimate,
        ltv_estimate: persona.ltv_estimate,
        appeal_howto: persona.appeal_howto,
        raw_persona_generated: rawPersonaData,
        user_id: user.id,
      }));

      console.log('Saving personas:', personasToSave);

      const { error: insertError } = await supabase
        .from('saved_personas')
        .insert(personasToSave);

      if (insertError) {
        console.error('Error saving personas:', insertError);
        toast({
          title: "Save Error",
          description: "Failed to save personas. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Personas have been saved successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error saving personas:', error);
      toast({
        title: "Save Error",
        description: "An unexpected error occurred while saving personas.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    personas,
    isLoading,
    isSaving,
    generatePersonas,
    savePersonas
  };
};
