
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
  appeal_how_to: string;
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
          appeal_how_to: persona.appeal_how_to || '',
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
          appeal_how_to: persona.appeal_how_to || persona.appeal_howto || '',
        }));
        setPersonas(mappedPersonas);
        
        // Auto-save the generated personas to the database
        try {
          console.log('=== AUTO-SAVE PERSONAS START ===');
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          console.log('Auto-save user:', user?.id, 'Error:', userError);
          
          if (userError) {
            console.error('Auto-save failed - user error:', userError);
            toast({
              title: "Auto-save Warning",
              description: "Personas generated but not saved automatically. Please use the Save button.",
              variant: "destructive"
            });
            return;
          }

          if (!user) {
            console.error('Auto-save failed - no user found');
            toast({
              title: "Auto-save Warning", 
              description: "Personas generated but not saved automatically. Please use the Save button.",
              variant: "destructive"
            });
            return;
          }

          // Delete existing saved personas for this user
          console.log('Deleting existing personas for user:', user.id);
          const { error: deleteError } = await supabase
            .from('saved_personas')
            .delete() 
            .eq('user_id', user.id);

          if (deleteError) {
            console.error('Auto-save delete error:', deleteError);
          } else {
            console.log('Successfully deleted existing personas');
          }

          // Insert the new personas
          console.log('Preparing personas for auto-save insert...');
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
            appeal_how_to: persona.appeal_how_to,
            raw_persona_generated: rawJson,
            user_id: user.id,
          }));

          console.log('Auto-save personas to insert:', JSON.stringify(personasToSave, null, 2));

          const { data: insertData, error: insertError } = await supabase
            .from('saved_personas')
            .insert(personasToSave)
            .select();

          console.log('Auto-save insert result:', { insertData, insertError });

          if (insertError) {
            console.error('Auto-save insert error:', insertError);
            toast({
              title: "Auto-save Failed",
              description: `Personas generated but auto-save failed: ${insertError.message}. Please use the Save button.`,
              variant: "destructive"
            });
          } else {
            console.log('Personas auto-saved successfully!', insertData);
            toast({
              title: "Success",
              description: "Personas generated and auto-saved successfully!",
            });
          }
          console.log('=== AUTO-SAVE PERSONAS END ===');
        } catch (error) {
          console.error('Error auto-saving personas:', error);
          toast({
            title: "Auto-save Error",
            description: "Personas generated but auto-save failed. Please use the Save button.",
            variant: "destructive"
          });
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
    console.log('=== SAVE PERSONAS FUNCTION CALLED ===');
    console.log('Current personas:', personas);
    console.log('Personas length:', personas.length);
    console.log('Raw persona data:', rawPersonaData);

    if (personas.length === 0) {
      console.log('No personas to save - showing error toast');
      toast({
        title: "No Personas to Save",
        description: "Please generate personas first before saving.",
        variant: "destructive"
      });
      return false;
    }

    setIsSaving(true);
    console.log('Set isSaving to true');

    try {
      // Get the current user
      console.log('Getting current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('User result:', user);
      console.log('User error:', userError);
      
      if (userError || !user) {
        console.error('Error getting user or no user found:', userError);
        toast({
          title: "Authentication Error",
          description: "You must be logged in to save personas.",
          variant: "destructive"
        });
        return false;
      }

      console.log('User authenticated successfully, user ID:', user.id);

      // First, delete existing saved personas for this user
      console.log('Deleting existing personas for user:', user.id);
      const { error: deleteError } = await supabase
        .from('saved_personas')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting existing personas:', deleteError);
      } else {
        console.log('Successfully deleted existing personas (or none existed)');
      }

      // Then insert the new personas
      console.log('Mapping personas for insertion...');
      const personasToSave = personas.map((persona, index) => {
        const mappedPersona = {
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
          appeal_how_to: persona.appeal_how_to,
          raw_persona_generated: rawPersonaData,
          user_id: user.id,
        };
        console.log(`Persona ${index + 1} mapped:`, mappedPersona);
        return mappedPersona;
      });

      console.log('Final personas to save:', JSON.stringify(personasToSave, null, 2));
      console.log('About to insert personas into database...');

      const { data: insertData, error: insertError } = await supabase
        .from('saved_personas')
        .insert(personasToSave)
        .select();

      console.log('Insert operation completed');
      console.log('Insert data:', insertData);
      console.log('Insert error:', insertError);

      if (insertError) {
        console.error('Error saving personas:', insertError);
        toast({
          title: "Save Error",
          description: `Failed to save personas: ${insertError.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('Personas saved successfully!');
      toast({
        title: "Success",
        description: "Personas have been saved successfully!",
      });
      return true;
    } catch (error) {
      console.error('Unexpected error in savePersonas:', error);
      toast({
        title: "Save Error",
        description: "An unexpected error occurred while saving personas.",
        variant: "destructive"
      });
      return false;
    } finally {
      console.log('Setting isSaving to false');
      setIsSaving(false);
      console.log('=== SAVE PERSONAS FUNCTION COMPLETED ===');
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
