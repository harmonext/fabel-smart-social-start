
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "@/hooks/useOnboarding";

interface SocialMediaSectionProps {
  formData: OnboardingData;
  onInputChange: (field: keyof OnboardingData, value: string) => void;
  onMultiSelectChange: (field: 'social_media_goals', value: string, checked: boolean) => void;
}

const SocialMediaSection = ({ formData, onInputChange, onMultiSelectChange }: SocialMediaSectionProps) => {
  const socialMediaGoalsOptions = [
    "Brand Awareness",
    "Lead Generation", 
    "Sales",
    "Customer Engagement",
    "Other"
  ];

  const contentToneOptions = [
    "Professional",
    "Casual",
    "Humorous",
    "Inspirational",
    "Authoritative"
  ];

  return (
    <>
      {/* Social Media Goals */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          What are your primary business goals with social media marketing? * (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {socialMediaGoalsOptions.map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox
                id={`goal-${goal}`}
                checked={formData.social_media_goals.includes(goal)}
                onCheckedChange={(checked) => 
                  onMultiSelectChange('social_media_goals', goal, !!checked)
                }
              />
              <Label htmlFor={`goal-${goal}`} className="text-sm">
                {goal}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tone */}
      <div className="space-y-3">
        <Label htmlFor="content_tone" className="text-base font-medium">
          What tone or voice do you prefer in your content? *
        </Label>
        <Select value={formData.content_tone} onValueChange={(value) => onInputChange('content_tone', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a tone for your content" />
          </SelectTrigger>
          <SelectContent>
            {contentToneOptions.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default SocialMediaSection;
