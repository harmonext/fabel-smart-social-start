
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyDetailsData, useCompanyDetails } from "@/hooks/useCompanyDetails";

interface CompanyDetailsFormProps {
  onContinue: () => void;
}

const CompanyDetailsForm = ({ onContinue }: CompanyDetailsFormProps) => {
  const { saveCompanyDetails, isSaving, companyDetails } = useCompanyDetails();
  const [formData, setFormData] = useState<CompanyDetailsData>({
    company_name: companyDetails?.company_name || "",
    company_industry: companyDetails?.company_industry || "",
    company_address: companyDetails?.company_address || ""
  });

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Consulting",
    "Marketing & Advertising",
    "Food & Beverage",
    "Transportation",
    "Entertainment",
    "Non-profit",
    "Other"
  ];

  const handleInputChange = (field: keyof CompanyDetailsData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    return formData.company_name.trim() !== '' && 
           formData.company_industry.trim() !== '' && 
           formData.company_address.trim() !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await saveCompanyDetails(formData);
    if (success) {
      onContinue();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text">Company Details</CardTitle>
          <CardDescription className="text-lg">
            Let's start by getting some basic information about your company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div className="space-y-3">
              <Label htmlFor="company_name" className="text-base font-medium">
                Company Name *
              </Label>
              <Input
                id="company_name"
                placeholder="Enter your company name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                required
              />
            </div>

            {/* Company Industry */}
            <div className="space-y-3">
              <Label htmlFor="company_industry" className="text-base font-medium">
                Industry *
              </Label>
              <Select value={formData.company_industry} onValueChange={(value) => handleInputChange('company_industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Address */}
            <div className="space-y-3">
              <Label htmlFor="company_address" className="text-base font-medium">
                Company Address *
              </Label>
              <Textarea
                id="company_address"
                placeholder="Enter your company's full address"
                value={formData.company_address}
                onChange={(e) => handleInputChange('company_address', e.target.value)}
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
                {isSaving ? "Saving..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetailsForm;
