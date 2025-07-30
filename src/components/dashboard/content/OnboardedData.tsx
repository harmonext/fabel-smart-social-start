import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { useMarketingOnboarding, MarketingOnboardingData } from "@/hooks/useMarketingOnboarding";
import { Separator } from "@/components/ui/separator";

const OnboardedData = () => {
  const { companyDetails } = useCompanyDetails();
  const { fetchOnboardingData } = useMarketingOnboarding();
  const [marketingData, setMarketingData] = useState<MarketingOnboardingData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchOnboardingData();
      setMarketingData(data);
    };
    loadData();
  }, [fetchOnboardingData]);

  if (!companyDetails || !marketingData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Onboarded Data</h1>
        <p className="text-muted-foreground">
          Your completed onboarding information
        </p>
      </div>

      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Company Name</label>
            <p className="text-lg">{companyDetails.company_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Industry</label>
            <p className="text-lg">{companyDetails.company_industry}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Address</label>
            <div className="text-lg space-y-1">
              <p>{companyDetails.street_address1}</p>
              {companyDetails.street_address2 && <p>{companyDetails.street_address2}</p>}
              <p>{companyDetails.city}, {companyDetails.state} {companyDetails.zip}</p>
              <p>{companyDetails.country}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
            <p className="text-lg">{companyDetails.phone_number}</p>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Onboarding Data */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Profile</CardTitle>
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
            <label className="text-sm font-medium text-muted-foreground">Business Category</label>
            <p className="text-lg">{marketingData.category}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Product Types</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {marketingData.product_types.map((type, index) => (
                <Badge key={index} variant="secondary">{type}</Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Store Type</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {marketingData.store_type.map((type, index) => (
                <Badge key={index} variant="secondary">{type}</Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Goals</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {marketingData.goals.map((goal, index) => (
                <Badge key={index} variant="outline">{goal}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Customer Demographics</h4>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketingData.customer_gender.map((gender, index) => (
                  <Badge key={index} variant="secondary">{gender}</Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Age Ranges</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketingData.customer_age_ranges.map((range, index) => (
                  <Badge key={index} variant="secondary">{range}</Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Income Ranges</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketingData.customer_income_ranges.map((range, index) => (
                  <Badge key={index} variant="secondary">{range}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardedData;