import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { MarketingOnboardingData } from "@/hooks/useMarketingOnboarding";

interface AboutCompanyTabProps {
  formData: MarketingOnboardingData;
  onInputChange: (field: keyof MarketingOnboardingData, value: string | string[]) => void;
}

const AboutCompanyTab = ({ formData, onInputChange }: AboutCompanyTabProps) => {
  const categoryOptions = [
    "Accessories", "Activities", "Advertising/Marketing", "Apparel", "Baby/Kids", 
    "Beauty", "Food/Beverage", "Health & Wellness", "Home", "Legal", "Medical", 
    "Other", "Pets", "Tech"
  ];

  const stageOptions = [
    "Idea", "Prototype", "Launched", "Scaling", "Mature"
  ];

  const productTypeOptions = [
    "Physical Goods", "Services", "Digital Goods"
  ];

  const storeTypeOptions = [
    "Brick and Mortar", "E-Commerce Site", "Other", "Pop-Up Shops", "Wholesale"
  ];

  const revenueOptions = [
    "$0-$5,000", "$5,000-$25,000", "$25,000-$50,000", "$50,000+"
  ];

  const handleProductTypeToggle = (productType: string) => {
    const currentTypes = formData.product_types;
    const newTypes = currentTypes.includes(productType)
      ? currentTypes.filter(type => type !== productType)
      : [...currentTypes, productType];
    onInputChange('product_types', newTypes);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Tell us about your company</h3>
        <p className="text-muted-foreground mb-6">
          Help us understand your business and current stage.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input
            id="company_name"
            type="text"
            placeholder="Enter your company name"
            value={formData.company_name}
            onChange={(e) => onInputChange('company_name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage">What stage are you in? *</Label>
          <Select value={formData.stage} onValueChange={(value) => onInputChange('stage', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your stage" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Types of product Sold? *</Label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {productTypeOptions.map((productType) => (
                <Badge
                  key={productType}
                  variant={formData.product_types.includes(productType) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleProductTypeToggle(productType)}
                >
                  {productType}
                  {formData.product_types.includes(productType) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="store_type">Store Type? *</Label>
          <Select value={formData.store_type} onValueChange={(value) => onInputChange('store_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your store type" />
            </SelectTrigger>
            <SelectContent>
              {storeTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly_revenue">How Much $$ Does It Bring in Monthly? *</Label>
          <Select value={formData.monthly_revenue} onValueChange={(value) => onInputChange('monthly_revenue', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your monthly revenue" />
            </SelectTrigger>
            <SelectContent>
              {revenueOptions.map((option) => (
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

export default AboutCompanyTab;