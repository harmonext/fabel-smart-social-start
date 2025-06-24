
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/hooks/useOnboarding";

interface CustomerInfoSectionProps {
  formData: OnboardingData;
  onInputChange: (field: keyof OnboardingData, value: string) => void;
}

const CustomerInfoSection = ({ formData, onInputChange }: CustomerInfoSectionProps) => {
  return (
    <>
      {/* Customer Profile */}
      <div className="space-y-3">
        <Label htmlFor="customer_profile" className="text-base font-medium">
          Who are your typical customers? Please describe their age, gender, occupation, interests, and location. *
        </Label>
        <Textarea
          id="customer_profile"
          placeholder="E.g., Women aged 25–40, working professionals, health-conscious, based in urban U.S. areas."
          value={formData.customer_profile}
          onChange={(e) => onInputChange('customer_profile', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>

      {/* Customer Problem */}
      <div className="space-y-3">
        <Label htmlFor="customer_problem" className="text-base font-medium">
          What problem does your product or service solve for your customers? *
        </Label>
        <Textarea
          id="customer_problem"
          placeholder="E.g., Helps people with sensitive skin maintain a healthy skincare routine."
          value={formData.customer_problem}
          onChange={(e) => onInputChange('customer_problem', e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>
    </>
  );
};

export default CustomerInfoSection;
