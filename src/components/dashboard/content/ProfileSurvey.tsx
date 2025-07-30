
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, CheckCircle } from "lucide-react";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";

const ProfileSurvey = () => {
  const { companyDetails, isLoading } = useCompanyDetails();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Company</h1>
          <p className="text-muted-foreground">Complete your company profile to generate personalized marketing personas.</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading company details...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Company</h1>
        <p className="text-muted-foreground">Complete your company profile to generate personalized marketing personas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Tell us about your business to create targeted marketing strategies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <div className="p-3 border rounded-lg bg-muted">
                {companyDetails?.company_name || "Not provided"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Industry</label>
              <div className="p-3 border rounded-lg bg-muted">
                {companyDetails?.company_industry || "Not provided"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="p-3 border rounded-lg bg-muted">
                {companyDetails?.phone_number || "Not provided"}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Company Address</label>
            <div className="p-3 border rounded-lg bg-muted min-h-20">
              {companyDetails ? (
                <div className="space-y-1">
                  <div>{companyDetails.street_address1}</div>
                  {companyDetails.street_address2 && <div>{companyDetails.street_address2}</div>}
                  <div>{companyDetails.city}, {companyDetails.state} {companyDetails.zip}</div>
                  <div>{companyDetails.country}</div>
                </div>
              ) : "Not provided"}
            </div>
          </div>
          
          {companyDetails && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Company details completed!</span>
            </div>
          )}
          
          <div className="pt-4 space-x-3">
            <Button className="bg-fabel-primary hover:bg-fabel-primary/90">
              Update Company
            </Button>
            <Button variant="outline">
              View Generated Personas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSurvey;
