import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MarketingOnboardingData } from "@/hooks/useMarketingOnboarding";
import { useState, KeyboardEvent } from "react";

interface AboutCustomerTabProps {
  formData: MarketingOnboardingData;
  onInputChange: (field: keyof MarketingOnboardingData, value: string | string[]) => void;
}

const AboutCustomerTab = ({ formData, onInputChange }: AboutCustomerTabProps) => {
  const [genderInput, setGenderInput] = useState("");
  
  const genderSuggestions = ["Female", "Male", "Non-Binary", "Other"];

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

  const addGender = (gender: string) => {
    const trimmedGender = gender.trim();
    if (trimmedGender && !formData.customer_gender.includes(trimmedGender)) {
      onInputChange('customer_gender', [...formData.customer_gender, trimmedGender]);
    }
    setGenderInput("");
  };

  const removeGender = (genderToRemove: string) => {
    const newGenders = formData.customer_gender.filter(g => g !== genderToRemove);
    onInputChange('customer_gender', newGenders);
  };

  const handleGenderKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addGender(genderInput);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addGender(suggestion);
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
          <p className="text-sm text-muted-foreground">
            Click on the genders that apply to your primary customers.
          </p>
          
          {/* Clickable gender tags */}
          <div className="flex flex-wrap gap-2">
            {genderSuggestions.map((gender) => {
              const isSelected = formData.customer_gender.includes(gender);
              return (
                <button
                  key={gender}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      removeGender(gender);
                    } else {
                      onInputChange('customer_gender', [...formData.customer_gender, gender]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    isSelected 
                      ? 'text-white border-transparent' 
                      : 'text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: isSelected ? '#E3C38A' : 'transparent'
                  }}
                >
                  {gender}
                </button>
              );
            })}
          </div>

          {/* Selected genders display */}
          {formData.customer_gender.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Selected genders:</p>
              <div className="flex flex-wrap gap-2">
                {formData.customer_gender.map((gender) => (
                  <Badge
                    key={gender}
                    variant="secondary"
                    className="flex items-center gap-1"
                    style={{ backgroundColor: '#E3C38A', color: 'white' }}
                  >
                    {gender}
                    <button
                      type="button"
                      onClick={() => removeGender(gender)}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
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