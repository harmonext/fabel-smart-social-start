import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketingOnboardingData } from "@/hooks/useMarketingOnboarding";

interface AboutYouTabProps {
  formData: MarketingOnboardingData;
  onInputChange: (field: keyof MarketingOnboardingData, value: string | string[]) => void;
}

const AboutYouTab = ({ formData, onInputChange }: AboutYouTabProps) => {
  const titleOptions = [
    "Owner",
    "Marketing Manager",
    "Marketing Agency",
    "Other"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Tell us about yourself</h3>
        <p className="text-muted-foreground mb-6">
          Let's start with some basic information about you and your role.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Select value={formData.title} onValueChange={(value) => onInputChange('title', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your title" />
            </SelectTrigger>
            <SelectContent>
              {titleOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AboutYouTab;