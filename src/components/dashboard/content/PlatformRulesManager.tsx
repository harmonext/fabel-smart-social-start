import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlatformRules } from '@/hooks/usePlatformRules';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Music, 
  Linkedin, 
  AtSign, 
  Facebook,
  MapPin,
  Settings,
  Info,
  AlertCircle
} from 'lucide-react';
import { SupportedPlatform, PLATFORM_COLORS } from '@/types/platformRules';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditRuleDialog } from './EditRuleDialog';
import { useUserRole } from '@/hooks/useUserRole';

const PLATFORM_ICONS: Record<SupportedPlatform, any> = {
  instagram: Instagram,
  tiktok: Music,
  linkedin: Linkedin,
  threads: AtSign,
  facebook: Facebook,
  pinterest: MapPin
};

interface PlatformRulesManagerProps {
  selectedPlatforms?: string[];
}

export const PlatformRulesManager = ({ selectedPlatforms }: PlatformRulesManagerProps) => {
  const { rules, constraints, loading, updateRule, refreshRules } = usePlatformRules(selectedPlatforms);
  const { isSuperAdmin } = useUserRole();
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SupportedPlatform | 'all'>('all');

  // Filter platforms based on selection
  const availablePlatforms = selectedPlatforms && selectedPlatforms.length > 0
    ? (selectedPlatforms as SupportedPlatform[])
    : (['instagram', 'tiktok', 'linkedin', 'threads', 'facebook', 'pinterest'] as SupportedPlatform[]);

  const displayedRules = selectedPlatform === 'all' 
    ? rules 
    : rules.filter(r => r.platform === selectedPlatform);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Content Rules</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage social media platform constraints
          </p>
        </div>
      </div>

      <Tabs value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as SupportedPlatform | 'all')}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          {availablePlatforms.map(platform => {
            const Icon = PLATFORM_ICONS[platform];
            return (
              <TabsTrigger key={platform} value={platform}>
                <Icon className="h-4 w-4 mr-2" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedPlatform} className="mt-6">
          <div className="grid gap-4">
            {availablePlatforms
              .filter(platform => selectedPlatform === 'all' || selectedPlatform === platform)
              .map(platform => {
                const platformConstraints = constraints[platform];
                const Icon = PLATFORM_ICONS[platform];
                
                if (!platformConstraints) return null;

                return (
                  <Card 
                    key={platform}
                    className="border-l-4"
                    style={{ borderLeftColor: PLATFORM_COLORS[platform] }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${PLATFORM_COLORS[platform]}20` }}
                          >
                            <Icon 
                              className="h-6 w-6" 
                              style={{ color: PLATFORM_COLORS[platform] }}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </CardTitle>
                            <CardDescription>Content constraints and limits</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Text Constraints */}
                      {platformConstraints.constraints.text.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            Text Constraints
                            <Badge variant="secondary">{platformConstraints.constraints.text.length}</Badge>
                          </h3>
                          <div className="grid gap-3">
                            {platformConstraints.constraints.text.map((constraint, idx) => (
                              <RuleRow
                                key={idx}
                                constraint={constraint}
                                platform={platform}
                                isSuperAdmin={isSuperAdmin}
                                onEdit={() => {
                                  const rule = rules.find(
                                    r => r.platform === platform && r.rule_name === constraint.rule_name
                                  );
                                  if (rule) setEditingRule(rule.id);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Media Constraints */}
                      {platformConstraints.constraints.media.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            Media Constraints
                            <Badge variant="secondary">{platformConstraints.constraints.media.length}</Badge>
                          </h3>
                          <div className="grid gap-3">
                            {platformConstraints.constraints.media.map((constraint, idx) => (
                              <RuleRow
                                key={idx}
                                constraint={constraint}
                                platform={platform}
                                isSuperAdmin={isSuperAdmin}
                                onEdit={() => {
                                  const rule = rules.find(
                                    r => r.platform === platform && r.rule_name === constraint.rule_name
                                  );
                                  if (rule) setEditingRule(rule.id);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Posting Constraints */}
                      {platformConstraints.constraints.posting.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            Posting Limits
                            <Badge variant="secondary">{platformConstraints.constraints.posting.length}</Badge>
                          </h3>
                          <div className="grid gap-3">
                            {platformConstraints.constraints.posting.map((constraint, idx) => (
                              <RuleRow
                                key={idx}
                                constraint={constraint}
                                platform={platform}
                                isSuperAdmin={isSuperAdmin}
                                onEdit={() => {
                                  const rule = rules.find(
                                    r => r.platform === platform && r.rule_name === constraint.rule_name
                                  );
                                  if (rule) setEditingRule(rule.id);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>

      {editingRule && (
        <EditRuleDialog
          ruleId={editingRule}
          rule={rules.find(r => r.id === editingRule)!}
          open={!!editingRule}
          onOpenChange={(open) => !open && setEditingRule(null)}
          onUpdate={async (updates) => {
            const success = await updateRule(editingRule, updates);
            if (success) setEditingRule(null);
          }}
        />
      )}
    </div>
  );
};

interface RuleRowProps {
  constraint: any;
  platform: string;
  isSuperAdmin: boolean;
  onEdit: () => void;
}

const RuleRow = ({ constraint, platform, isSuperAdmin, onEdit }: RuleRowProps) => {
  const formatValue = (value: any, unit?: string) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (unit) {
      return `${value} ${unit}`;
    }
    return value.toString();
  };

  const formatRuleName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{constraint.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex-1">
          <p className="font-medium text-sm">{formatRuleName(constraint.rule_name)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {constraint.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono">
          {formatValue(constraint.value, constraint.unit)}
        </Badge>
        
        {isSuperAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
