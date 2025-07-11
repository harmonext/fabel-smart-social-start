import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { MarketingOnboardingData } from "@/hooks/useMarketingOnboarding";

interface AboutCustomerTabProps {
  formData: MarketingOnboardingData;
  onInputChange: (field: keyof MarketingOnboardingData, value: string | string[]) => void;
}

const AboutCustomerTab = ({ formData, onInputChange }: AboutCustomerTabProps) => {
  const genderOptions = [
    { value: "Female", label: "Female" },
    { value: "Male", label: "Male" },
    { value: "Non-Binary", label: "Non-Binary" }
  ];

  const ageRangeOptions = [
    "0-18", "18-25", "25-34", "35-44", "45+"
  ];

  const incomeRangeOptions = [
    "Less than $20,000",
    "$20,000 to $49,999", 
    "$50,000 to $99,999",
    "Over $100,000"
  ];

  const handleAgeRangeToggle = (ageRange: string, checked: boolean) => {
    const currentRanges = formData.customer_age_ranges;
    const newRanges = checked
      ? [...currentRanges, ageRange]
      : currentRanges.filter(range => range !== ageRange);
    onInputChange('customer_age_ranges', newRanges);
  };

  const handleIncomeRangeToggle = (incomeRange: string, checked: boolean) => {
    const currentRanges = formData.customer_income_ranges;
    const newRanges = checked
      ? [...currentRanges, incomeRange]
      : currentRanges.filter(range => range !== incomeRange);
    onInputChange('customer_income_ranges', newRanges);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Tell us about your customer</h3>
        <p className="text-muted-foreground mb-6">
          Help us understand who your primary customers are.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>What's the Gender of Your Primary Customer? *</Label>
          <RadioGroup 
            value={formData.customer_gender} 
            onValueChange={(value) => onInputChange('customer_gender', value)}
          >
            {genderOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                <Label htmlFor={`gender-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Typical Age Range? *</Label>
          <p className="text-sm text-muted-foreground">
            Select all age ranges that apply to your customers.
          </p>
          <div className="space-y-2">
            {ageRangeOptions.map((ageRange) => (
              <div key={ageRange} className="flex items-center space-x-2">
                <Checkbox
                  id={`age-${ageRange}`}
                  checked={formData.customer_age_ranges.includes(ageRange)}
                  onCheckedChange={(checked) => handleAgeRangeToggle(ageRange, checked as boolean)}
                />
                <Label htmlFor={`age-${ageRange}`}>{ageRange}</Label>
              </div>
            ))}
          </div>
          {formData.customer_age_ranges.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Selected: {formData.customer_age_ranges.length} age range{formData.customer_age_ranges.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Typical Income Range? *</Label>
          <p className="text-sm text-muted-foreground">
            Select all income ranges that apply to your customers.
          </p>
          <div className="space-y-2">
            {incomeRangeOptions.map((incomeRange) => (
              <div key={incomeRange} className="flex items-center space-x-2">
                <Checkbox
                  id={`income-${incomeRange}`}
                  checked={formData.customer_income_ranges.includes(incomeRange)}
                  onCheckedChange={(checked) => handleIncomeRangeToggle(incomeRange, checked as boolean)}
                />
                <Label htmlFor={`income-${incomeRange}`}>{incomeRange}</Label>
              </div>
            ))}
          </div>
          {formData.customer_income_ranges.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Selected: {formData.customer_income_ranges.length} income range{formData.customer_income_ranges.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutCustomerTab;