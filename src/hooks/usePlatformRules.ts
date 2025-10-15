import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlatformRule, PlatformConstraint, SupportedPlatform } from '@/types/platformRules';

export const usePlatformRules = (selectedPlatforms?: string[]) => {
  const [rules, setRules] = useState<PlatformRule[]>([]);
  const [constraints, setConstraints] = useState<Record<string, PlatformConstraint>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlatformRules();
  }, [selectedPlatforms]);

  const fetchPlatformRules = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('platform_rules')
        .select('*')
        .eq('is_active', true)
        .order('platform', { ascending: true })
        .order('rule_type', { ascending: true });

      // Filter by selected platforms if provided
      if (selectedPlatforms && selectedPlatforms.length > 0) {
        query = query.in('platform', selectedPlatforms);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching platform rules:', error);
        toast({
          title: 'Error loading platform rules',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      setRules((data || []) as PlatformRule[]);
      
      // Organize rules into constraints structure
      const constraintsMap: Record<string, PlatformConstraint> = {};
      
      (data || []).forEach((rule) => {
        if (!constraintsMap[rule.platform]) {
          constraintsMap[rule.platform] = {
            platform: rule.platform,
            constraints: {
              text: [],
              media: [],
              posting: []
            }
          };
        }

        const ruleValueObj = rule.rule_value as any;
        const constraint = {
          rule_name: rule.rule_name,
          value: ruleValueObj.value || ruleValueObj.values || rule.rule_value,
          description: rule.description || '',
          unit: ruleValueObj.unit
        };

        if (rule.rule_type === 'text') {
          constraintsMap[rule.platform].constraints.text.push(constraint);
        } else if (rule.rule_type === 'media') {
          constraintsMap[rule.platform].constraints.media.push(constraint);
        } else if (rule.rule_type === 'posting') {
          constraintsMap[rule.platform].constraints.posting.push(constraint);
        }
      });

      setConstraints(constraintsMap);
    } catch (error) {
      console.error('Error in fetchPlatformRules:', error);
      toast({
        title: 'Unexpected error',
        description: 'Failed to load platform rules',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRule = async (ruleId: string, updates: Partial<PlatformRule>) => {
    try {
      const { error } = await supabase
        .from('platform_rules')
        .update(updates)
        .eq('id', ruleId);

      if (error) {
        toast({
          title: 'Error updating rule',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Rule updated',
        description: 'Platform rule has been successfully updated'
      });

      await fetchPlatformRules();
      return true;
    } catch (error) {
      console.error('Error updating rule:', error);
      toast({
        title: 'Update failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  };

  const getRulesByPlatform = (platform: SupportedPlatform) => {
    return rules.filter(rule => rule.platform === platform);
  };

  const getConstraintsByPlatform = (platform: SupportedPlatform) => {
    return constraints[platform] || null;
  };

  return {
    rules,
    constraints,
    loading,
    updateRule,
    getRulesByPlatform,
    getConstraintsByPlatform,
    refreshRules: fetchPlatformRules
  };
};
