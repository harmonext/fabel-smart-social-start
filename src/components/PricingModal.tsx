import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan?: "free" | "basic" | "business";
}

const PricingModal = ({ open, onOpenChange, currentPlan = "free" }: PricingModalProps) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const handleUpgrade = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
    onOpenChange(false);
  };

  const handleBackToPricing = () => {
    setCheckoutOpen(false);
    onOpenChange(true);
  };

  const plans = [
    {
      id: "free",
      name: "Nursery Rhymes",
      subtitle: "Solopreneur / Individual",
      price: "Free",
      features: [
        "1 user",
        "1 Customer Persona",
        "Demographics, psychographics, location",
        "Preferred social channels",
        "1 Social Platform",
        "Email, Google SSO, or Apple SSO"
      ],
      highlighted: false,
    },
    {
      id: "basic",
      name: "Short Story",
      subtitle: "Marketing Freelancer, SMB",
      price: "TBD",
      features: [
        "Everything in Free, plus:",
        "Up to 3 users",
        "Canva, Google Drive, Dropbox Integration",
        "Enhanced Personas (LTV, CAC, SEO keywords)",
        "Social Content Creation + Auto Deployment",
        "1 Social Set (up to 6 profiles)",
        "Invite up to 2 members"
      ],
      highlighted: true,
      badge: "Most Popular"
    },
    {
      id: "business",
      name: "Novels",
      subtitle: "Marketing Agency / SMB Team",
      price: "TBD",
      features: [
        "Everything in Basic, plus:",
        "Up to 5 users",
        "Competitor Analysis",
        "Content Analysis + Optimization",
        "3 Social Sets (up to 12 profiles)",
        "Edit and add Customer Personas",
        "Invite up to 4 members"
      ],
      highlighted: false,
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Choose Your Plan
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Select the perfect plan for your marketing needs
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-6 transition-all duration-300 hover:scale-105 ${
                plan.highlighted
                  ? "border-fabel-primary shadow-lg shadow-fabel-primary/20 bg-gradient-to-b from-fabel-primary/5 to-transparent"
                  : "border-border hover:border-fabel-primary/50"
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fabel-primary text-white">
                  {plan.badge}
                </Badge>
              )}
              
              {currentPlan === plan.id && (
                <Badge variant="outline" className="absolute top-4 right-4 border-fabel-primary text-fabel-primary">
                  Current Plan
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.subtitle}</p>
                <div className="text-4xl font-bold text-fabel-primary mb-2">
                  {plan.price}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-fabel-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  currentPlan === plan.id
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : plan.highlighted
                    ? "bg-fabel-primary hover:bg-fabel-primary/90 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
                disabled={currentPlan === plan.id}
                onClick={() => !currentPlan || currentPlan === plan.id ? null : handleUpgrade(plan)}
              >
                {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>

      {selectedPlan && (
        <CheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          selectedPlan={selectedPlan}
          onChangePlan={handleBackToPricing}
        />
      )}
    </Dialog>
  );
};

export default PricingModal;
