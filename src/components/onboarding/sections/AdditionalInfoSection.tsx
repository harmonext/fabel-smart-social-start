
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/hooks/useOnboarding";

interface AdditionalInfoSectionProps {
  formData: OnboardingData;
  onInputChange: (field: keyof OnboardingData, value: string) => void;
}

const AdditionalInfoSection = ({ formData, onInputChange }: AdditionalInfoSectionProps) => {
  return (
    <>
      {/* Top Customer Questions */}
      <div className="space-y-3">
        <Label htmlFor="top_customer_questions" className="text-base font-medium">
          What are the top 3 questions your customers frequently ask before buying from you? *
        </Label>
        <Textarea
          id="top_customer_questions"
          placeholder="E.g., Is your product safe for children? Do you ship internationally? How long before I see results?"
          value={formData.top_customer_questions}
          onChange={(e) => onInputChange('top_customer_questions', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      {/* Target Segments */}
      <div className="space-y-3">
        <Label htmlFor="target_segments" className="text-base font-medium">
          Are there any specific industries, job roles, or communities you want to target with your campaigns? *
        </Label>
        <Textarea
          id="target_segments"
          placeholder="E.g., HR Managers, Working Moms, Tech Startups, Small Retail Businesses"
          value={formData.target_segments}
          onChange={(e) => onInputChange('target_segments', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      {/* Customer Values */}
      <div className="space-y-3">
        <Label htmlFor="customer_values" className="text-base font-medium">
          What are some common values, interests, or lifestyles your customers identify with? *
        </Label>
        <Textarea
          id="customer_values"
          placeholder="E.g., Eco-conscious, fitness enthusiasts, career-driven millennials"
          value={formData.customer_values}
          onChange={(e) => onInputChange('customer_values', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>
    </>
  );
};

export default AdditionalInfoSection;
