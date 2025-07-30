import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AddressCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    zip: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user metadata with address information
      const { error } = await supabase.auth.updateUser({
        data: {
          street_address1: formData.streetAddress1,
          street_address2: formData.streetAddress2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Address saved successfully",
        description: "Your address information has been updated.",
      });

      navigate('/onboarding');
    } catch (error: any) {
      toast({
        title: "Error saving address",
        description: error.message || "Failed to save address information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Address Information</CardTitle>
          <p className="text-muted-foreground text-center">
            Please provide your address information to complete your account setup
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streetAddress1">Street Address</Label>
              <Input
                id="streetAddress1"
                name="streetAddress1"
                type="text"
                placeholder="123 Main Street"
                value={formData.streetAddress1}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetAddress2">Street Address 2 (Optional)</Label>
              <Input
                id="streetAddress2"
                name="streetAddress2"
                type="text"
                placeholder="Apt, Suite, Unit, etc."
                value={formData.streetAddress2}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="NY"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                name="zip"
                type="text"
                placeholder="10001"
                value={formData.zip}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressCollection;