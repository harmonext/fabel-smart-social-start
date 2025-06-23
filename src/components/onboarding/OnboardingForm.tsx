import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData, useOnboarding } from "@/hooks/useOnboarding";

const OnboardingForm = () => {
  const navigate = useNavigate();
  const { saveOnboarding, isSaving } = useOnboarding();
  const [formData, setFormData] = useState<OnboardingData>({
    business_name_description: "",
    customer_profile: "",
    customer_problem: "",
    unique_selling_proposition: "",
    social_media_goals: [],
    content_tone: "",
    preferred_platforms: [],
    top_customer_questions: "",
    target_segments: "",
    customer_values: ""
  });

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

  const platformOptions = [
    "LinkedIn",
    "Facebook",
    "Instagram",
    "Twitter/X",
    "Pinterest",
    "TikTok",
    "Other"
  ];

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field: 'social_media_goals' | 'preferred_platforms', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'business_name_description',
      'customer_profile', 
      'customer_problem',
      'unique_selling_proposition',
      'content_tone',
      'top_customer_questions',
      'target_segments',
      'customer_values'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof OnboardingData] || (formData[field as keyof OnboardingData] as string).trim() === '') {
        return false;
      }
    }

    if (formData.social_media_goals.length === 0 || formData.preferred_platforms.length === 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await saveOnboarding(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text">Company Onboarding</CardTitle>
          <CardDescription className="text-lg">
            Help us understand your business so we can create personalized marketing content for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Name and Description */}
            <div className="space-y-3">
              <Label htmlFor="business_name_description" className="text-base font-medium">
                What is the name of your business and what products or services do you offer? *
              </Label>
              <Textarea
                id="business_name_description"
                placeholder="E.g., FreshGlow is a skincare brand offering organic face creams, cleansers, and toners."
                value={formData.business_name_description}
                onChange={(e) => handleInputChange('business_name_description', e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Customer Profile */}
            <div className="space-y-3">
              <Label htmlFor="customer_profile" className="text-base font-medium">
                Who are your typical customers? Please describe their age, gender, occupation, interests, and location. *
              </Label>
              <Textarea
                id="customer_profile"
                placeholder="E.g., Women aged 25–40, working professionals, health-conscious, based in urban U.S. areas."
                value={formData.customer_profile}
                onChange={(e) => handleInputChange('customer_profile', e.target.value)}
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
                onChange={(e) => handleInputChange('customer_problem', e.target.value)}
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
                onChange={(e) => handleInputChange('unique_selling_proposition', e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

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
                        handleMultiSelectChange('social_media_goals', goal, !!checked)
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
              <Select value={formData.content_tone} onValueChange={(value) => handleInputChange('content_tone', value)}>
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

            {/* Preferred Platforms */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Which social media platforms do your customers use most frequently? * (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {platformOptions.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={formData.preferred_platforms.includes(platform)}
                      onCheckedChange={(checked) => 
                        handleMultiSelectChange('preferred_platforms', platform, !!checked)
                      }
                    />
                    <Label htmlFor={`platform-${platform}`} className="text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customer Questions */}
            <div className="space-y-3">
              <Label htmlFor="top_customer_questions" className="text-base font-medium">
                What are the top 3 questions your customers frequently ask before buying from you? *
              </Label>
              <Textarea
                id="top_customer_questions"
                placeholder="E.g., Is your product safe for children? Do you ship internationally? How long before I see results?"
                value={formData.top_customer_questions}
                onChange={(e) => handleInputChange('top_customer_questions', e.target.value)}
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
                onChange={(e) => handleInputChange('target_segments', e.target.value)}
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
                onChange={(e) => handleInputChange('customer_values', e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full gradient-fabel text-white py-3 text-lg"
                disabled={isSaving || !validateForm()}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
