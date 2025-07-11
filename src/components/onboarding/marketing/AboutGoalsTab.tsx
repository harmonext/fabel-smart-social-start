import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { MarketingOnboardingData } from "@/hooks/useMarketingOnboarding";

interface AboutGoalsTabProps {
  formData: MarketingOnboardingData;
  onInputChange: (field: keyof MarketingOnboardingData, value: string | string[]) => void;
}

const AboutGoalsTab = ({ formData, onInputChange }: AboutGoalsTabProps) => {
  const goalOptions = [
    "Generate Leads",
    "Grow Revenue", 
    "Increase Brand Awareness",
    "Increase Traffic",
    "Validate an Idea"
  ];

  const handleGoalToggle = (goal: string) => {
    const currentGoals = formData.goals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    onInputChange('goals', newGoals);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Tell us about your goals</h3>
        <p className="text-muted-foreground mb-6">
          What are you hoping to achieve with your marketing efforts?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tell Us About Your Current Goals *</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select all that apply to your current business objectives.
          </p>
          <div className="flex flex-wrap gap-2">
            {goalOptions.map((goal) => (
              <Badge
                key={goal}
                variant={formData.goals.includes(goal) ? "default" : "outline"}
                className="cursor-pointer py-2 px-3"
                onClick={() => handleGoalToggle(goal)}
              >
                {goal}
                {formData.goals.includes(goal) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
          {formData.goals.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected: {formData.goals.length} goal{formData.goals.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutGoalsTab;