
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, CheckCircle } from "lucide-react";

const ProfileSurvey = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Company Profile Survey</h1>
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
              <div className="p-3 border rounded-lg bg-muted">Acme Marketing Solutions</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Industry</label>
              <div className="p-3 border rounded-lg bg-muted">Digital Marketing</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Company Description</label>
            <div className="p-3 border rounded-lg bg-muted min-h-20">
              We help small businesses grow their online presence through strategic digital marketing campaigns and social media management.
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Target Audience</label>
            <div className="p-3 border rounded-lg bg-muted min-h-20">
              Small to medium-sized businesses looking to improve their digital marketing efforts and increase online visibility.
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Key Products/Services</label>
            <div className="p-3 border rounded-lg bg-muted min-h-20">
              Social media management, content creation, SEO optimization, paid advertising campaigns, and marketing strategy consultation.
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700">Survey completed! Your personas are ready.</span>
          </div>
          
          <div className="pt-4 space-x-3">
            <Button className="bg-fabel-primary hover:bg-fabel-primary/90">
              Update Survey
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
