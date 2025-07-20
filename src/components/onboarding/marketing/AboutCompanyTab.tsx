
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

const AboutCompanyTab = ({
  formData,
  onInputChange
}: AboutCompanyTabProps) => {
  const categoryOptions = ["Accessories", "Activities", "Advertising/Marketing", "Apparel", "Baby/Kids", "Beauty", "Food/Beverage", "Health & Wellness", "Home", "Legal", "Medical", "Other", "Pets", "Tech"];
  const stageOptions = ["Idea", "Prototype", "Launched", "Scaling", "Mature"];
  const productTypeOptions = ["Physical Goods", "Services", "Digital Goods"];
  const storeTypeOptions = ["Brick and Mortar", "E-Commerce Site", "Other", "Pop-Up Shops", "Wholesale"];
  const revenueOptions = ["$0-$5,000", "$5,000-$25,000", "$25,000-$50,000", "$50,000+"];

  const handleProductTypeToggle = (productType: string) => {
    const currentTypes = Array.isArray(formData.product_types) ? formData.product_types : [];
    console.log('Product type clicked:', productType, 'Current types:', currentTypes);
    const newTypes = currentTypes.includes(productType) 
      ? currentTypes.filter(type => type !== productType) 
      : [...currentTypes, productType];
    console.log('New product types:', newTypes);
    onInputChange('product_types', newTypes);
  };

  const handleStoreTypeToggle = (storeType: string) => {
    const currentTypes = Array.isArray(formData.store_type) ? formData.store_type : [];
    console.log('Store type clicked:', storeType, 'Current types:', currentTypes);
    const newTypes = currentTypes.includes(storeType) 
      ? currentTypes.filter(type => type !== storeType) 
      : [...currentTypes, storeType];
    console.log('New store types:', newTypes);
    onInputChange('store_type', newTypes);
  };

  console.log('AboutCompanyTab formData:', formData);
  
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
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={value => onInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
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
              {productTypeOptions.map(productType => {
                const currentProductTypes = Array.isArray(formData.product_types) ? formData.product_types : [];
                const isSelected = currentProductTypes.includes(productType);
                return (
                  <Badge 
                    key={productType} 
                    variant={isSelected ? "default" : "outline"} 
                    className={`cursor-pointer ${isSelected ? 'text-white border-0' : 'text-foreground'}`} 
                    style={{
                      backgroundColor: isSelected ? '#E3C38A' : 'transparent',
                      color: isSelected ? 'white' : undefined
                    }} 
                    onClick={() => handleProductTypeToggle(productType)}
                  >
                    {productType}
                    {isSelected && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>And Where Do You Sell Them? *</Label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {storeTypeOptions.map(storeType => {
                const currentStoreTypes = Array.isArray(formData.store_type) ? formData.store_type : [];
                const isSelected = currentStoreTypes.includes(storeType);
                return (
                  <Badge 
                    key={storeType} 
                    variant={isSelected ? "default" : "outline"} 
                    className={`cursor-pointer ${isSelected ? 'text-white border-0' : 'text-foreground'}`} 
                    style={{
                      backgroundColor: isSelected ? '#E3C38A' : 'transparent',
                      color: isSelected ? 'white' : undefined
                    }} 
                    onClick={() => handleStoreTypeToggle(storeType)}
                  >
                    {storeType}
                    {isSelected && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompanyTab;
