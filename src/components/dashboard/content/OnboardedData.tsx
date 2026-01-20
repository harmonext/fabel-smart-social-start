import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { useMarketingOnboarding, MarketingOnboardingData } from "@/hooks/useMarketingOnboarding";
import { Separator } from "@/components/ui/separator";
import { Pencil, Check, X, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const OnboardedData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    companyDetails,
    saveCompanyDetails,
    isSaving
  } = useCompanyDetails();
  const {
    fetchOnboardingData
  } = useMarketingOnboarding();
  const [marketingData, setMarketingData] = useState<MarketingOnboardingData | null>(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedIndustry, setEditedIndustry] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchOnboardingData();
      setMarketingData(data);
    };
    loadData();
  }, [fetchOnboardingData]);

  useEffect(() => {
    if (companyDetails) {
      setEditedName(companyDetails.name || "");
      setEditedIndustry(companyDetails.industry || "");
    }
  }, [companyDetails]);

  const handleEditCompany = () => {
    setIsEditingCompany(true);
  };

  const handleCancelEdit = () => {
    setEditedName(companyDetails?.name || "");
    setEditedIndustry(companyDetails?.industry || "");
    setIsEditingCompany(false);
  };

  const handleSaveCompany = async () => {
    if (!editedName.trim() || !editedIndustry.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name and industry are required.",
        variant: "destructive"
      });
      return;
    }

    const success = await saveCompanyDetails({
      name: editedName,
      industry: editedIndustry,
      street_address1: companyDetails?.street_address1 || "",
      city: companyDetails?.city || "",
      state: companyDetails?.state || "",
      country: companyDetails?.country || "",
      zip: companyDetails?.zip || "",
      phone_number: companyDetails?.phone_number || ""
    });

    if (success) {
      setIsEditingCompany(false);
      toast({
        title: "Success",
        description: "Company details updated successfully."
      });
    }
  };

  const handleEditOnboarding = () => {
    navigate("/marketing-onboarding");
  };

  if (!companyDetails || !marketingData) {
    return <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>;
  }

  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Onboarded Data</h1>
        <p className="text-muted-foreground">
          Your completed onboarding information
        </p>
      </div>

      {/* Company Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Company Information</CardTitle>
          {!isEditingCompany ? (
            <Button variant="outline" size="sm" onClick={handleEditCompany}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveCompany} disabled={isSaving}>
                <Check className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Company Name</label>
            {isEditingCompany ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter company name"
                className="mt-1"
              />
            ) : (
              <p className="text-lg">{companyDetails.name}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Industry</label>
            {isEditingCompany ? (
              <Select value={editedIndustry} onValueChange={setEditedIndustry}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-lg">{companyDetails.industry}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Onboarding Data */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Marketing Profile</CardTitle>
          <Button variant="outline" size="sm" onClick={handleEditOnboarding}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Survey
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg">{marketingData.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="text-lg">{marketingData.title}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Business Industry</label>
            <p className="text-lg">{marketingData.industry}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Product Types</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {marketingData.product_types.map((type, index) => <Badge key={index} variant="secondary">{type}</Badge>)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Store Type</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {marketingData.store_type.map((type, index) => <Badge key={index} variant="secondary">{type}</Badge>)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Goals</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {marketingData.goals.map((goal, index) => <Badge key={index} variant="outline">{goal}</Badge>)}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Customer Demographics</h4>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketingData.customer_gender.map((gender, index) => <Badge key={index} variant="secondary">{gender}</Badge>)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Age Ranges</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketingData.customer_age_ranges.map((range, index) => <Badge key={index} variant="secondary">{range}</Badge>)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Income Ranges</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketingData.customer_income_ranges.map((range, index) => <Badge key={index} variant="secondary">{range}</Badge>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default OnboardedData;