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
  maxPlatforms?: number; // Maximum platforms allowed (default: 3)
}

const AVAILABLE_PLATFORMS = [
  { name: "LinkedIn", value: "linkedin", icon: "fab fa-linkedin", color: "text-[#0077B5]" },
  { name: "Threads", value: "threads", icon: "fab fa-threads", color: "text-[#000000]" },
  { name: "Facebook", value: "facebook", icon: "fab fa-facebook", color: "text-[#1877F2]" },
  { name: "Instagram", value: "instagram", icon: "fab fa-instagram", color: "text-[#E4405F]" },
  { name: "TikTok", value: "tiktok", icon: "fab fa-tiktok", color: "text-[#000000]" },
  { name: "Pinterest", value: "pinterest", icon: "fab fa-pinterest", color: "text-[#BD081C]" },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  isOpen,
  onClose,
  currentPlatforms,
  aiPlatforms,
  onSave,
  maxPlatforms = 3,
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
      // If less than max selected, add it
      if (prev.length < maxPlatforms) {
        return [...prev, platform];
      }
      // If max already selected, show toast
      toast.error(`You can only select up to ${maxPlatforms} platform${maxPlatforms > 1 ? 's' : ''}`);
      return prev;
    });
  };

  const handleResetToAI = () => {
    setSelectedPlatforms(aiPlatforms);
    toast.success("Reset to AI recommendations");
  };

  const handleSave = () => {
    if (selectedPlatforms.length !== maxPlatforms) {
      toast.error(`Please select exactly ${maxPlatforms} platform${maxPlatforms > 1 ? 's' : ''}`);
      return;
    }
    onSave(selectedPlatforms);
    onClose();
  };

  const isSelected = (platform: string) => selectedPlatforms.includes(platform);
  const isAIRecommended = (platform: string) => aiPlatforms.includes(platform);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Social Platforms
          </DialogTitle>
          <DialogDescription>
            Select {maxPlatforms} platform{maxPlatforms > 1 ? 's' : ''} for this persona. Click on a platform to add or remove it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected platforms display */}
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-sm font-medium mb-3 text-muted-foreground">
              Selected ({selectedPlatforms.length}/{maxPlatforms}):
            </p>
            <div className="flex gap-3 flex-wrap min-h-[60px]">
              {selectedPlatforms.map((platform, index) => {
                const platformData = AVAILABLE_PLATFORMS.find((p) => p.value === platform);
                return (
                  <div
                    key={platform}
                    className="flex items-center gap-2 bg-primary/20 border border-primary px-4 py-2 rounded-full"
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
                      relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${
                        selected
                          ? "border-primary bg-primary/20 shadow-lg shadow-primary/20 scale-105"
                          : "border-border bg-card hover:border-primary/50 hover:bg-muted/50 hover:scale-102"
                      }
                    `}
                  >
                    {/* Selection indicator */}
                    <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground/30 bg-transparent"
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {aiRecommended && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                        AI
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <i className={`${platform.icon} ${platform.color} text-2xl`} />
                      <span className="text-xs font-medium text-center">{platform.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleResetToAI}
            >
              Reset to AI Recommendations
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedPlatforms.length !== maxPlatforms}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
