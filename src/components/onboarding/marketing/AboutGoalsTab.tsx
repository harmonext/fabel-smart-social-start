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
    const isSelected = currentGoals.includes(goal);
    
    if (isSelected) {
      // Allow deselecting
      const newGoals = currentGoals.filter(g => g !== goal);
      onInputChange('goals', newGoals);
    } else if (currentGoals.length < 2) {
      // Only allow selecting if less than 2 are already selected
      const newGoals = [...currentGoals, goal];
      onInputChange('goals', newGoals);
    }
    // If 2 are already selected and trying to select a new one, do nothing
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
            Select up to 2 that apply to your current business objectives.
          </p>
           <div className="flex flex-wrap gap-2">
             {goalOptions.map((goal) => {
               const isSelected = formData.goals.includes(goal);
               return (
                 <Badge
                   key={goal}
                   variant={isSelected ? "default" : "outline"}
                   className={`cursor-pointer ${isSelected ? 'text-white border-0' : 'text-foreground'}`}
                   style={{
                     backgroundColor: isSelected ? '#E3C38A' : 'transparent',
                     color: isSelected ? 'white' : undefined
                   }}
                   onClick={() => handleGoalToggle(goal)}
                 >
                   {goal}
                   {isSelected && <X className="h-3 w-3 ml-1" />}
                 </Badge>
               );
             })}
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