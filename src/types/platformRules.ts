// TypeScript interfaces for Platform Rules Management System

export interface PlatformRule {
  id: string;
  platform: string;
  rule_type: 'text' | 'media' | 'posting';
  rule_name: string;
  rule_value: Record<string, any>;
  description: string | null;
  is_active: boolean;
  is_customizable: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformConstraint {
  platform: string;
  constraints: {
    text: TextConstraint[];
    media: MediaConstraint[];
    posting: PostingConstraint[];
  };
}

export interface TextConstraint {
  rule_name: string;
  value: number;
  description: string;
  unit?: string;
}

export interface MediaConstraint {
  rule_name: string;
  value: any;
  description: string;
  unit?: string;
}

export interface PostingConstraint {
  rule_name: string;
  value: number;
  description: string;
}

export interface RuleValidationResult {
  isValid: boolean;
  violations: RuleViolation[];
  warnings: RuleWarning[];
}

export interface RuleViolation {
  platform: string;
  rule_name: string;
  rule_type: string;
  current_value: any;
  max_value: any;
  message: string;
}

export interface RuleWarning {
  platform: string;
  rule_name: string;
  rule_type: string;
  current_value: any;
  recommended_value: any;
  message: string;
}

export type SupportedPlatform = 'instagram' | 'tiktok' | 'linkedin' | 'threads' | 'facebook' | 'pinterest';

export const PLATFORM_ICONS: Record<SupportedPlatform, string> = {
  instagram: '📷',
  tiktok: '🎵',
  linkedin: '💼',
  threads: '🧵',
  facebook: '👥',
  pinterest: '📌'
};

export const PLATFORM_COLORS: Record<SupportedPlatform, string> = {
  instagram: 'hsl(330, 75%, 50%)',
  tiktok: 'hsl(349, 88%, 60%)',
  linkedin: 'hsl(201, 100%, 35%)',
  threads: 'hsl(0, 0%, 0%)',
  facebook: 'hsl(221, 44%, 41%)',
  pinterest: 'hsl(0, 78%, 50%)'
};
