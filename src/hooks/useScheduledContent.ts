import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type ScheduledContent = Tables<'scheduled_content'>;
export type ScheduledContentInsert = TablesInsert<'scheduled_content'>;
export type ScheduledContentUpdate = TablesUpdate<'scheduled_content'>;

export const useScheduledContent = () => {
  const [content, setContent] = useState<ScheduledContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('scheduled_content')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) {
        throw error;
      }

      setContent(data || []);
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scheduled content. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createContent = async (newContent: ScheduledContentInsert) => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('scheduled_content')
        .insert(newContent)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setContent(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Content created successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error creating scheduled content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create content. Please try again.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = async (id: string, updates: ScheduledContentUpdate) => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('scheduled_content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setContent(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Success",
        description: "Content updated successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error updating scheduled content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update content. Please try again.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('scheduled_content')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Content deleted successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error deleting scheduled content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete content. Please try again.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getContentByStatus = (status: ScheduledContent['status']) => {
    return content.filter(item => item.status === status);
  };

  const getContentByDate = (date: Date) => {
    return content.filter(item => {
      if (!item.scheduled_at) return false;
      const itemDate = new Date(item.scheduled_at);
      return itemDate.getDate() === date.getDate() && 
             itemDate.getMonth() === date.getMonth() && 
             itemDate.getFullYear() === date.getFullYear();
    });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    isLoading,
    isSaving,
    createContent,
    updateContent,
    deleteContent,
    getContentByStatus,
    getContentByDate,
    refetch: fetchContent
  };
};