import { PlatformRule, RuleValidationResult, RuleViolation, RuleWarning, SupportedPlatform } from '@/types/platformRules';

interface ContentToValidate {
  title?: string;
  content: string;
  platform: SupportedPlatform;
  media_url?: string;
  hashtags?: string[];
}

export const validateContent = (
  content: ContentToValidate,
  platformRules: PlatformRule[]
): RuleValidationResult => {
  const violations: RuleViolation[] = [];
  const warnings: RuleWarning[] = [];

  const rules = platformRules.filter(rule => rule.platform === content.platform);

  // Extract hashtags from content
  const hashtagMatches = content.content.match(/#\w+/g) || [];
  const hashtagCount = hashtagMatches.length + (content.hashtags?.length || 0);

  rules.forEach(rule => {
    switch (rule.rule_name) {
      case 'caption_max_length':
      case 'post_max_length':
      case 'description_max_length': {
        const maxLength = rule.rule_value.value;
        const currentLength = content.content.length;
        
        if (currentLength > maxLength) {
          violations.push({
            platform: content.platform,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            current_value: currentLength,
            max_value: maxLength,
            message: `Your ${getPlatformName(content.platform)} ${getContentTypeName(rule.rule_name)} exceeds the ${maxLength} character limit (current: ${currentLength})`
          });
        } else if (currentLength > maxLength * 0.9) {
          warnings.push({
            platform: content.platform,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            current_value: currentLength,
            recommended_value: maxLength,
            message: `Approaching character limit (${currentLength}/${maxLength})`
          });
        }
        break;
      }

      case 'hashtag_max_count': {
        const maxHashtags = rule.rule_value.value;
        
        if (hashtagCount > maxHashtags) {
          violations.push({
            platform: content.platform,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            current_value: hashtagCount,
            max_value: maxHashtags,
            message: `Too many hashtags for ${getPlatformName(content.platform)} (${hashtagCount}/${maxHashtags})`
          });
        }
        break;
      }

      case 'pin_title_max_length': {
        const maxLength = rule.rule_value.value;
        const titleLength = content.title?.length || 0;
        
        if (titleLength > maxLength) {
          violations.push({
            platform: content.platform,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            current_value: titleLength,
            max_value: maxLength,
            message: `Pin title exceeds ${maxLength} character limit (current: ${titleLength})`
          });
        }
        break;
      }

      case 'recommended_length': {
        const recommendedLength = rule.rule_value.value;
        const currentLength = content.content.length;
        
        if (currentLength > recommendedLength) {
          warnings.push({
            platform: content.platform,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            current_value: currentLength,
            recommended_value: recommendedLength,
            message: `For best engagement on ${getPlatformName(content.platform)}, keep posts under ${recommendedLength} characters`
          });
        }
        break;
      }

      case 'video_aspect_ratio':
      case 'image_aspect_ratio': {
        if (content.media_url) {
          const requiredRatio = rule.rule_value.value;
          warnings.push({
            platform: content.platform,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            current_value: 'unknown',
            recommended_value: requiredRatio,
            message: `${getPlatformName(content.platform)} requires ${requiredRatio} aspect ratio`
          });
        }
        break;
      }

      case 'video_aspect_ratios':
      case 'image_aspect_ratios': {
        if (content.media_url) {
          const supportedRatios = rule.rule_value.values.join(', ');
          warnings.push({
            platform: content.platform,
            rule_name: rule.rule_name,
            rule_type: rule.rule_type,
            current_value: 'unknown',
            recommended_value: supportedRatios,
            message: `${getPlatformName(content.platform)} supports aspect ratios: ${supportedRatios}`
          });
        }
        break;
      }
    }
  });

  return {
    isValid: violations.length === 0,
    violations,
    warnings
  };
};

const getPlatformName = (platform: string): string => {
  const names: Record<string, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    twitter: 'X/Twitter',
    facebook: 'Facebook',
    pinterest: 'Pinterest'
  };
  return names[platform] || platform;
};

const getContentTypeName = (ruleName: string): string => {
  if (ruleName.includes('caption')) return 'caption';
  if (ruleName.includes('post')) return 'post';
  if (ruleName.includes('description')) return 'description';
  return 'content';
};

export const countHashtags = (text: string): number => {
  const matches = text.match(/#\w+/g);
  return matches ? matches.length : 0;
};

export const extractHashtags = (text: string): string[] => {
  const matches = text.match(/#\w+/g);
  return matches || [];
};
