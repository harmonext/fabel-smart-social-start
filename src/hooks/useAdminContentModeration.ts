import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AdminContentItem {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  platform: string;
  status: string;
  persona_name: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  engagement_data: any;
  created_at: string;
  updated_at: string;
  goal: string | null;
  media_url: string | null;
  ai_moderation_status: string | null;
  ai_moderation_confidence: number | null;
  ai_moderation_violations: string[] | null;
  ai_moderation_reasons: string[] | null;
  ai_moderation_recommendations: string[] | null;
  ai_moderation_risk_level: string | null;
  ai_moderated_at: string | null;
  admin_moderation_status: string | null;
  admin_moderation_reason: string | null;
  admin_moderated_by: string | null;
  admin_moderated_at: string | null;
  company_name: string | null;
  company_industry: string | null;
}

export const useAdminContentModeration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<AdminContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const fetchContent = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('secure-admin-moderation', {
        body: { action: 'list' },
      });

      if (error) throw error;
      
      setContent(data?.content || []);
    } catch (error) {
      console.error('Error fetching admin content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content for moderation. Admin access required.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const moderateContent = async (
    contentId: string, 
    decision: 'approved' | 'denied', 
    reason?: string
  ) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.functions.invoke('secure-admin-moderation', {
        body: {
          action: 'moderate',
          contentId,
          decision,
          reason
        },
      });

      if (error) throw error;

      // Update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? {
              ...item,
              admin_moderation_status: decision,
              admin_moderation_reason: reason || null,
              admin_moderated_by: user.id,
              admin_moderated_at: new Date().toISOString()
            }
          : item
      ));

      toast({
        title: "Content Moderated",
        description: `Content has been ${decision}`,
      });

      return true;
    } catch (error) {
      console.error('Error moderating content:', error);
      toast({
        title: "Error",
        description: "Failed to moderate content. Admin access required.",
        variant: "destructive",
      });
      return false;
    }
  };

  const bulkModerateContent = async (
    contentIds: string[], 
    decision: 'approved' | 'denied', 
    reason?: string
  ) => {
    if (!user || contentIds.length === 0) return false;

    try {
      const { data, error } = await supabase.functions.invoke('secure-admin-moderation', {
        body: {
          action: 'bulk_moderate',
          contentIds,
          decision,
          reason
        },
      });

      if (error) throw error;

      // Update local state
      setContent(prev => prev.map(item => 
        contentIds.includes(item.id)
          ? {
              ...item,
              admin_moderation_status: decision,
              admin_moderation_reason: reason || null,
              admin_moderated_by: user.id,
              admin_moderated_at: new Date().toISOString()
            }
          : item
      ));

      // Clear selection
      setSelectedItems(new Set());

      toast({
        title: "Bulk Moderation Complete",
        description: `${contentIds.length} items have been ${decision}`,
      });

      return true;
    } catch (error) {
      console.error('Error bulk moderating content:', error);
      toast({
        title: "Error",
        description: "Failed to bulk moderate content. Admin access required.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAll = (items: AdminContentItem[]) => {
    setSelectedItems(new Set(items.map(item => item.id)));
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const getFilteredContent = (status: 'approved' | 'denied' | 'pending') => {
    return content.filter(item => {
      switch (status) {
        case 'approved':
          return item.ai_moderation_status === 'approved' || item.admin_moderation_status === 'approved';
        case 'denied':
          return item.ai_moderation_status === 'denied' || item.admin_moderation_status === 'denied';
        case 'pending':
          return (item.ai_moderation_status === 'pending' || !item.ai_moderation_status) && 
                 !item.admin_moderation_status;
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    fetchContent();
  }, [user]);

  return {
    content,
    loading,
    selectedItems,
    fetchContent,
    moderateContent,
    bulkModerateContent,
    toggleSelection,
    selectAll,
    clearSelection,
    getFilteredContent
  };
};