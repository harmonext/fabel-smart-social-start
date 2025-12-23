import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { SupportedPlatform } from '@/types/platformRules';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'media' | 'posting';
  status: 'pending' | 'passed' | 'failed';
  currentValue?: string | number;
  requiredValue?: string | number;
  message?: string;
}

interface ContentValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: SupportedPlatform | string;
  content: string;
  title?: string;
  mediaUrl?: string;
  onAcceptSchedule: () => void;
}

// Mock platform rules - these will come from backend later
const getMockRulesForPlatform = (platform: string): Omit<ValidationRule, 'status' | 'currentValue'>[] => {
  const baseRules = [
    {
      id: 'char_limit',
      name: 'Character Limit',
      description: 'Maximum characters allowed for post content',
      type: 'text' as const,
      requiredValue: platform === 'twitter' ? 280 : platform === 'linkedin' ? 3000 : 2200,
    },
    {
      id: 'hashtag_count',
      name: 'Hashtag Count',
      description: 'Maximum number of hashtags recommended',
      type: 'text' as const,
      requiredValue: platform === 'instagram' ? 30 : platform === 'twitter' ? 5 : 10,
    },
    {
      id: 'link_count',
      name: 'Link Limit',
      description: 'Maximum links allowed in post',
      type: 'text' as const,
      requiredValue: platform === 'instagram' ? 0 : 5,
    },
  ];

  const mediaRules = [
    {
      id: 'image_format',
      name: 'Image Format',
      description: 'Supported image formats for the platform',
      type: 'media' as const,
      requiredValue: 'JPG, PNG, GIF, WebP',
    },
    {
      id: 'video_duration',
      name: 'Video Duration',
      description: 'Maximum video length allowed',
      type: 'media' as const,
      requiredValue: platform === 'tiktok' ? '10 min' : platform === 'instagram' ? '60 min' : '15 min',
    },
  ];

  const postingRules = [
    {
      id: 'posting_frequency',
      name: 'Posting Frequency',
      description: 'Recommended posts per day',
      type: 'posting' as const,
      requiredValue: platform === 'twitter' ? 15 : 3,
    },
  ];

  return [...baseRules, ...mediaRules, ...postingRules];
};

// Validation logic using mock rules
const validateAgainstRules = (
  rules: Omit<ValidationRule, 'status' | 'currentValue'>[],
  content: string,
  mediaUrl?: string
): ValidationRule[] => {
  const hashtagCount = (content.match(/#\w+/g) || []).length;
  const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
  const charCount = content.length;

  return rules.map(rule => {
    let status: 'passed' | 'failed' = 'passed';
    let currentValue: string | number = 0;
    let message: string | undefined;

    switch (rule.id) {
      case 'char_limit':
        currentValue = charCount;
        if (charCount > (rule.requiredValue as number)) {
          status = 'failed';
          message = `Content is ${charCount - (rule.requiredValue as number)} characters over the limit`;
        }
        break;
      case 'hashtag_count':
        currentValue = hashtagCount;
        if (hashtagCount > (rule.requiredValue as number)) {
          status = 'failed';
          message = `Too many hashtags (${hashtagCount} used, max ${rule.requiredValue})`;
        }
        break;
      case 'link_count':
        currentValue = linkCount;
        if (linkCount > (rule.requiredValue as number)) {
          status = 'failed';
          message = `Too many links (${linkCount} used, max ${rule.requiredValue})`;
        }
        break;
      case 'image_format':
        currentValue = mediaUrl ? 'Valid' : 'No media';
        status = 'passed';
        break;
      case 'video_duration':
        currentValue = mediaUrl ? 'Valid' : 'No video';
        status = 'passed';
        break;
      case 'posting_frequency':
        currentValue = 'Within limit';
        status = 'passed';
        break;
      default:
        status = 'passed';
    }

    return {
      ...rule,
      status,
      currentValue,
      message,
    };
  });
};

export const ContentValidationDialog: React.FC<ContentValidationDialogProps> = ({
  open,
  onOpenChange,
  platform,
  content,
  title,
  mediaUrl,
  onAcceptSchedule,
}) => {
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setIsValidating(true);
      setValidationComplete(false);
      
      // Get mock rules for the platform
      const mockRules = getMockRulesForPlatform(platform);
      
      // Set initial pending state
      setRules(mockRules.map(rule => ({ ...rule, status: 'pending' as const, currentValue: undefined })));
      
      // Simulate progressive validation
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex >= mockRules.length) {
          clearInterval(interval);
          setIsValidating(false);
          setValidationComplete(true);
          return;
        }
        
        // Validate rules one by one for visual effect
        const validatedRules = validateAgainstRules(mockRules.slice(0, currentIndex + 1), content, mediaUrl);
        setRules(prev => {
          const updated = [...prev];
          for (let i = 0; i <= currentIndex; i++) {
            updated[i] = validatedRules[i];
          }
          return updated;
        });
        
        currentIndex++;
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [open, platform, content, mediaUrl]);

  const allPassed = validationComplete && rules.every(rule => rule.status === 'passed');
  const failedCount = rules.filter(rule => rule.status === 'failed').length;
  const passedCount = rules.filter(rule => rule.status === 'passed').length;

  const handleAcceptSchedule = () => {
    onAcceptSchedule();
    onOpenChange(false);
  };

  const getStatusIcon = (status: ValidationRule['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />;
    }
  };

  const getStatusBgColor = (status: ValidationRule['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'failed':
        return 'bg-destructive/10 border-destructive/30';
      case 'pending':
        return 'bg-muted/50 border-border';
    }
  };

  const getRuleTypeLabel = (type: ValidationRule['type']) => {
    switch (type) {
      case 'text':
        return 'Text';
      case 'media':
        return 'Media';
      case 'posting':
        return 'Posting';
    }
  };

  const getRuleTypeBadgeColor = (type: ValidationRule['type']) => {
    switch (type) {
      case 'text':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'media':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
      case 'posting':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isValidating ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : allPassed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
            Content Validation
          </DialogTitle>
          <DialogDescription>
            Validating your content against <span className="font-medium capitalize">{platform}</span> platform rules
          </DialogDescription>
        </DialogHeader>

        {/* Progress Summary */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">{passedCount} Passed</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">{failedCount} Failed</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{rules.filter(r => r.status === 'pending').length} Pending</span>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-3 mt-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3 rounded-lg border transition-all duration-300 ${getStatusBgColor(rule.status)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRuleTypeBadgeColor(rule.type)}`}>
                      {getRuleTypeLabel(rule.type)}
                    </span>
                    <h4 className="text-sm font-medium">{rule.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                  
                  {rule.status !== 'pending' && (
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">
                        Current: <span className="font-medium text-foreground">{rule.currentValue}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Required: <span className="font-medium text-foreground">{rule.requiredValue}</span>
                      </span>
                    </div>
                  )}
                  
                  {rule.message && rule.status === 'failed' && (
                    <p className="mt-2 text-xs text-destructive font-medium">{rule.message}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {getStatusIcon(rule.status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t mt-4">
          {allPassed ? (
            <Button onClick={handleAcceptSchedule} className="flex-1 bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Accept Schedule
            </Button>
          ) : (
            <Button 
              disabled 
              className="flex-1"
              variant="outline"
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Fix {failedCount} Issue{failedCount !== 1 ? 's' : ''} to Schedule
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
