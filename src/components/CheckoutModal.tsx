import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: {
    id: string;
    name: string;
    subtitle: string;
    price: string;
    features: string[];
  };
  onChangePlan: () => void;
}

type Step = "summary" | "billing" | "review" | "success";

const CheckoutModal = ({ open, onOpenChange, selectedPlan, onChangePlan }: CheckoutModalProps) => {
  const [step, setStep] = useState<Step>("summary");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === "summary") setStep("billing");
    else if (step === "billing") setStep("review");
    else if (step === "review") setStep("success");
  };

  const handleBack = () => {
    if (step === "billing") setStep("summary");
    else if (step === "review") setStep("billing");
  };

  const handleClose = () => {
    setStep("summary");
    onOpenChange(false);
  };

  const steps = [
    { key: "summary", label: "Plan" },
    { key: "billing", label: "Billing" },
    { key: "review", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step !== "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Complete Your Upgrade
              </DialogTitle>
            </DialogHeader>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 my-6">
              {steps.map((s, index) => (
                <div key={s.key} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                      index <= currentStepIndex
                        ? "bg-fabel-primary text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-12 h-0.5 mx-3 transition-all",
                        index < currentStepIndex ? "bg-fabel-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 1: Plan Summary */}
        {step === "summary" && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-lg border-2 border-fabel-primary/20 bg-gradient-to-b from-fabel-primary/5 to-transparent p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPlan.subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-fabel-primary">{selectedPlan.price}</div>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Included features:</p>
                {selectedPlan.features.slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-fabel-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-fabel-primary hover:text-fabel-primary hover:bg-fabel-primary/10"
                onClick={() => {
                  handleClose();
                  onChangePlan();
                }}
              >
                Change Plan
              </Button>
            </div>

            <Button onClick={handleNext} className="w-full bg-fabel-primary hover:bg-fabel-primary/90 text-white">
              Continue to Billing
            </Button>
          </div>
        )}

        {/* Step 2: Billing Info */}
        {step === "billing" && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Payment Information</h3>
                <Badge variant="outline" className="border-fabel-primary text-fabel-primary">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Payment
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => handleInputChange("expiry", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={(e) => handleInputChange("cvc", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold mb-4">Billing Address</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="94102"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-fabel-primary hover:bg-fabel-primary/90 text-white">
                Continue to Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === "review" && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between items-start pb-4 border-b">
                <div>
                  <p className="font-medium">{selectedPlan.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedPlan.subtitle}</p>
                </div>
                <p className="font-semibold text-fabel-primary">{selectedPlan.price}</p>
              </div>

              <div className="space-y-2 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium transition-all",
                        billingCycle === "monthly"
                          ? "bg-fabel-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium transition-all",
                        billingCycle === "annual"
                          ? "bg-fabel-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      Annual
                    </button>
                  </div>
                </div>
                {billingCycle === "annual" && (
                  <p className="text-xs text-fabel-primary text-right">Save 20% with annual billing</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Total Due Today</span>
                <span className="text-2xl font-bold text-fabel-primary">{selectedPlan.price}</span>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 space-y-3">
              <h3 className="font-semibold mb-2">Billing Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span> {formData.name || "Not provided"}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span> {formData.email || "Not provided"}
                </p>
                {formData.company && (
                  <p>
                    <span className="text-muted-foreground">Company:</span> {formData.company}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Card:</span> •••• {formData.cardNumber.slice(-4) || "****"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-fabel-primary hover:bg-fabel-primary/90 text-white transition-all hover:scale-105"
              >
                Confirm & Pay
              </Button>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {step === "success" && (
          <div className="space-y-6 py-8 text-center animate-fade-in">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center animate-scale-in">
                <Check className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">🎉 Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your Fabel plan has been upgraded to <span className="font-semibold text-fabel-primary">{selectedPlan.name}</span>
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 space-y-2 text-left">
              <p className="text-sm">
                <span className="text-muted-foreground">Plan:</span> <span className="font-medium">{selectedPlan.name}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Billing:</span> <span className="font-medium">{billingCycle === "monthly" ? "Monthly" : "Annual"}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.email}</span>
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-fabel-primary hover:bg-fabel-primary/90 text-white">
              Get Started
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
