import { useEffect, useState } from 'react';
import { PlatformRulesManager } from './PlatformRulesManager';
import { usePersonas } from '@/hooks/usePersonas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * Wrapper component that displays platform rules filtered by persona-selected platforms
 * This ensures users only see rules relevant to their active social media platforms
 */
export const PlatformRulesWrapper = () => {
  const { personas } = usePersonas();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique platforms from personas
    const platformsSet = new Set<string>();
    
    personas.forEach(persona => {
      // Get platforms from user_platforms if available
      if (persona.user_platforms && Array.isArray(persona.user_platforms)) {
        persona.user_platforms.forEach((platform: string) => {
          platformsSet.add(platform.toLowerCase());
        });
      }
      
      // Fallback to social media top platforms if user_platforms not set
      if (persona.social_media_top_1_active && persona.social_media_top_1) {
        platformsSet.add(persona.social_media_top_1.toLowerCase());
      }
      if (persona.social_media_top_2_active && persona.social_media_top_2) {
        platformsSet.add(persona.social_media_top_2.toLowerCase());
      }
      if (persona.social_media_top_3_active && persona.social_media_top_3) {
        platformsSet.add(persona.social_media_top_3.toLowerCase());
      }
    });

    setSelectedPlatforms(Array.from(platformsSet));
  }, [personas]);

  if (personas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Content Rules</CardTitle>
          <CardDescription>
            Social media platform constraints and guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">No personas configured</p>
              <p className="text-sm text-blue-700 mt-1">
                Create personas first to see platform-specific content rules. The rules will be filtered based on the platforms you select in your personas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {selectedPlatforms.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Showing rules for your selected platforms
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  These rules are filtered based on the platforms configured in your personas:{' '}
                  <span className="font-semibold">
                    {selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <PlatformRulesManager selectedPlatforms={selectedPlatforms} />
    </div>
  );
};
