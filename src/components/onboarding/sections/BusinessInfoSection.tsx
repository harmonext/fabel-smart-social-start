
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/hooks/useOnboarding";

interface BusinessInfoSectionProps {
  formData: OnboardingData;
  onInputChange: (field: keyof OnboardingData, value: string) => void;
}

const BusinessInfoSection = ({ formData, onInputChange }: BusinessInfoSectionProps) => {
  return (
    <>
      {/* Business Name and Description */}
      <div className="space-y-3">
        <Label htmlFor="business_name_description" className="text-base font-medium">
          What is the name of your business and what products or services do you offer? *
        </Label>
        <Textarea
          id="business_name_description"
          placeholder="E.g., FreshGlow is a skincare brand offering organic face creams, cleansers, and toners."
          value={formData.business_name_description}
          onChange={(e) => onInputChange('business_name_description', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      {/* Unique Selling Proposition */}
      <div className="space-y-3">
        <Label htmlFor="unique_selling_proposition" className="text-base font-medium">
          What makes your business different or unique from your competitors? *
        </Label>
        <Textarea
          id="unique_selling_proposition"
          placeholder="E.g., We use 100% organic ingredients and donate a portion of profits to environmental causes."
          value={formData.unique_selling_proposition}
          onChange={(e) => onInputChange('unique_selling_proposition', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>
    </>
  );
};

export default BusinessInfoSection;
