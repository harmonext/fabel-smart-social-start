
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
    name: companyDetails?.name || "",
    industry: companyDetails?.industry || "",
    street_address1: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone_number: ""
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
    return formData.name.trim() !== '' && 
           formData.industry.trim() !== '';
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
              <Label htmlFor="name" className="text-base font-medium">
                Company Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter your company name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* Company Industry */}
            <div className="space-y-3">
              <Label htmlFor="industry" className="text-base font-medium">
                Industry *
              </Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
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
