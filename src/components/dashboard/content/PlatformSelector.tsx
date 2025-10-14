import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PlatformSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlatforms: string[];
  aiPlatforms: string[];
  onSave: (platforms: string[]) => void;
}

const AVAILABLE_PLATFORMS = [
  { name: "LinkedIn", value: "linkedin", icon: "fab fa-linkedin", color: "text-[#0077B5]" },
  { name: "Twitter/X", value: "twitter", icon: "fab fa-twitter", color: "text-[#1DA1F2]" },
  { name: "Facebook", value: "facebook", icon: "fab fa-facebook", color: "text-[#1877F2]" },
  { name: "Instagram", value: "instagram", icon: "fab fa-instagram", color: "text-[#E4405F]" },
  { name: "TikTok", value: "tiktok", icon: "fab fa-tiktok", color: "text-[#000000]" },
  { name: "YouTube", value: "youtube", icon: "fab fa-youtube", color: "text-[#FF0000]" },
  { name: "Pinterest", value: "pinterest", icon: "fab fa-pinterest", color: "text-[#BD081C]" },
  { name: "WhatsApp", value: "whatsapp", icon: "fab fa-whatsapp", color: "text-[#25D366]" },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  isOpen,
  onClose,
  currentPlatforms,
  aiPlatforms,
  onSave,
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlatforms(currentPlatforms);
    }
  }, [isOpen, currentPlatforms]);

  const handlePlatformClick = (platform: string) => {
    setSelectedPlatforms((prev) => {
      // If already selected, remove it
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform);
      }
      // If less than 3 selected, add it
      if (prev.length < 3) {
        return [...prev, platform];
      }
      // If 3 already selected, show toast
      toast.error("You can only select up to 3 platforms");
      return prev;
    });
  };

  const handleResetToAI = () => {
    setSelectedPlatforms(aiPlatforms);
    toast.success("Reset to AI recommendations");
  };

  const handleSave = () => {
    if (selectedPlatforms.length !== 3) {
      toast.error("Please select exactly 3 platforms");
      return;
    }
    onSave(selectedPlatforms);
    onClose();
  };

  const isSelected = (platform: string) => selectedPlatforms.includes(platform);
  const isAIRecommended = (platform: string) => aiPlatforms.includes(platform);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[hsl(222.2,84%,4.9%)] border-fabel-primary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Edit Social Platforms
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select 3 platforms for this persona. Click on a platform to add or remove it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected platforms display */}
          <div className="bg-card/50 rounded-lg p-4 border border-fabel-primary/30">
            <p className="text-sm font-medium mb-3 text-muted-foreground">
              Selected ({selectedPlatforms.length}/3):
            </p>
            <div className="flex gap-3 flex-wrap min-h-[60px]">
              {selectedPlatforms.map((platform, index) => {
                const platformData = AVAILABLE_PLATFORMS.find((p) => p.value === platform);
                return (
                  <div
                    key={platform}
                    className="flex items-center gap-2 bg-fabel-primary/20 border border-fabel-primary px-4 py-2 rounded-full"
                  >
                    <span className="text-sm font-medium">{index + 1}.</span>
                    {platformData && <i className={`${platformData.icon} ${platformData.color} text-lg`} />}
                    <span className="text-sm font-medium">{platformData?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available platforms grid */}
          <div>
            <p className="text-sm font-medium mb-3 text-muted-foreground">
              Available Platforms:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVAILABLE_PLATFORMS.map((platform) => {
                const selected = isSelected(platform.value);
                const aiRecommended = isAIRecommended(platform.value);

                return (
                  <button
                    key={platform.value}
                    onClick={() => handlePlatformClick(platform.value)}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all duration-200
                      ${
                        selected
                          ? "border-fabel-primary bg-fabel-primary/20 shadow-lg shadow-fabel-primary/20"
                          : "border-border bg-card hover:border-fabel-primary/50 hover:bg-card/80"
                      }
                    `}
                  >
                    {aiRecommended && (
                      <div className="absolute -top-2 -right-2 bg-fabel-primary text-[hsl(222.2,84%,4.9%)] text-xs px-2 py-0.5 rounded-full font-semibold">
                        AI
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <i className={`${platform.icon} ${platform.color} text-2xl`} />
                      <span className="text-xs font-medium text-center">{platform.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleResetToAI}
              className="border-fabel-primary/50 text-fabel-primary hover:bg-fabel-primary/10"
            >
              Reset to AI Recommendations
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedPlatforms.length !== 3}
              className="bg-fabel-primary hover:bg-fabel-primary/90 text-[hsl(222.2,84%,4.9%)] font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
