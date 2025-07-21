import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Persona } from "@/hooks/usePersonas";
interface PlatformData {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  content: string;
}
interface GeneratedContent {
  platform: string;
  text: string;
}
interface Persona1Props {
  persona?: Persona | any; // Allow fallback default personas
}

const Persona1 = ({ persona }: Persona1Props) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEditingPlatform, setCurrentEditingPlatform] = useState<string | null>(null);
  const [modalText, setModalText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const getSocialMediaIcon = (platform: string) => {
    const platformName = platform?.toLowerCase();
    
    const SocialIcon = ({ className }: { className: string }) => (
      <i className={`${className}`} />
    );

    switch (platformName) {
      case 'linkedin':
        return { icon: () => <SocialIcon className="fab fa-linkedin text-[#0077B5]" />, color: 'text-[#0077B5]', name: 'LinkedIn' };
      case 'twitter':
      case 'x':
        return { icon: () => <SocialIcon className="fab fa-x-twitter text-brand-dark" />, color: 'text-brand-dark', name: 'Twitter/X' };
      case 'youtube':
        return { icon: () => <SocialIcon className="fab fa-youtube text-[#FF0000]" />, color: 'text-[#FF0000]', name: 'YouTube' };
      case 'facebook':
        return { icon: () => <SocialIcon className="fab fa-facebook text-[#1877F2]" />, color: 'text-[#1877F2]', name: 'Facebook' };
      case 'instagram':
        return { icon: () => <SocialIcon className="fab fa-instagram text-[#E4405F]" />, color: 'text-[#E4405F]', name: 'Instagram' };
      case 'whatsapp':
        return { icon: () => <SocialIcon className="fab fa-whatsapp text-[#25D366]" />, color: 'text-[#25D366]', name: 'WhatsApp' };
      case 'tiktok':
        return { icon: () => <SocialIcon className="fab fa-tiktok text-brand-dark" />, color: 'text-brand-dark', name: 'TikTok' };
      case 'pinterest':
        return { icon: () => <SocialIcon className="fab fa-pinterest text-[#BD081C]" />, color: 'text-[#BD081C]', name: 'Pinterest' };
      default:
        return { icon: () => <SocialIcon className="fas fa-share-alt text-muted-foreground" />, color: 'text-muted-foreground', name: 'Social Media' };
    }
  };

  const socialMediaPlatforms = [
    persona?.social_media_top_1,
    persona?.social_media_top_2,
    persona?.social_media_top_3
  ].filter(Boolean);

  const platformData: Record<string, PlatformData> = {
    linkedin: {
      name: 'LinkedIn',
      icon: () => <i className="fab fa-linkedin" />,
      color: 'text-[#0077B5]',
      content: `Looking to advance your career? Our professional development programs help ambitious professionals like you reach the next level. Connect with industry leaders and unlock your potential. #CareerGrowth #ProfessionalDevelopment #Leadership`
    },
    twitter: {
      name: 'Twitter/X',
      icon: () => <i className="fab fa-x-twitter" />,
      color: 'text-brand-dark',
      content: `🚀 Ready to level up your career game? Our mentorship programs connect you with top executives who've been where you want to go. Apply now! #CareerGoals #Mentorship #Success`
    },
    youtube: {
      name: 'YouTube',
      icon: () => <i className="fab fa-youtube" />,
      color: 'text-[#FF0000]',
      content: `Watch how our alumni went from entry-level to C-suite in just 5 years! Get the insider strategies that transformed their careers. Subscribe for more success stories! #CareerTransformation #ExecutiveCoaching`
    }
  };
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]);
  };
  const handleGenerateContent = () => {
    if (selectedPlatforms.length === 0) {
      return;
    }
    setIsGenerating(true);
    setGeneratedContent([]);
    setTimeout(() => {
      const content = selectedPlatforms.map(platform => ({
        platform,
        text: platformData[platform].content
      }));
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 1500);
  };
  const handleEditContent = (platform: string) => {
    const currentContent = generatedContent.find(c => c.platform === platform);
    setCurrentEditingPlatform(platform);
    setModalText(currentContent?.text || '');
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };
  const handleSaveChanges = () => {
    if (currentEditingPlatform) {
      setGeneratedContent(prev => prev.map(content => content.platform === currentEditingPlatform ? {
        ...content,
        text: modalText
      } : content));
      handleCloseModal();
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEditingPlatform(null);
    setModalText("");
    setImageFile(null);
    setImagePreview(null);
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="bg-muted rounded-lg p-6 space-y-4 h-full flex flex-col">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-bold text-muted-foreground">{persona?.name || "The Ambitious Entrepreneur"}</h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{persona?.description || "Small business owners who are growth-focused and tech-savvy"}</p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-2">Social Media Platforms:</h2>
        <TooltipProvider>
          <div className="flex items-center justify-center space-x-8">
            {socialMediaPlatforms.slice(0, 3).map((platform, index) => {
              const { icon: Icon, color, name } = getSocialMediaIcon(platform);
              return (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xl">
                        <Icon />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Checkbox disabled />
                </div>
              );
            })}
            {/* Fill remaining slots with empty spaces if less than 3 platforms */}
            {Array.from({ length: Math.max(0, 3 - socialMediaPlatforms.length) }).map((_, index) => (
              <div key={`empty-${index}`} className="flex flex-col items-center space-y-2">
                <Share2 className="w-6 h-6 text-muted-foreground opacity-30" />
                <Checkbox disabled />
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-1">Location:</h2>
        <p className="text-xs text-muted-foreground">
          {persona?.location || "Urban/Suburban"}
        </p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-1">Psychographics:</h2>
        <p className="text-xs text-muted-foreground">
          {persona?.psychographics || "Growth-focused, tech-savvy, efficiency-oriented"}
        </p>
      </div>

      <div className="flex justify-center space-x-8">
        <div className="text-center">
          <h2 className="font-bold text-sm">Age Range:</h2>
          <p className="text-xs text-muted-foreground">{persona?.age_ranges || "28-45"}</p>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-sm">Gender:</h2>
          <p className="text-xs text-muted-foreground">{persona?.genders || "All"}</p>
        </div>
      </div>
        
      <div className="pt-2 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <i className="fa-solid fa-lock text-lg text-muted-foreground"></i>
          <h2 className="font-bold text-sm">Unlock for:</h2>
        </div>
        <p className="text-xs text-muted-foreground flex items-start justify-start">
          <i className="fa-solid fa-users mr-1"></i>
          Top Competitors: {persona?.top_competitors || "Competitors analysis"}
        </p>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <i className="fa-solid fa-dollar-sign"></i>
          CAC: {persona?.cac_estimate || "$50-100"}
        </p>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <i className="fa-solid fa-infinity"></i>
          LTV: {persona?.ltv_estimate || "$500-1000"}
        </p>
        <p className="text-xs text-muted-foreground flex items-start justify-start">
          <i className="fa-solid fa-heart mr-0.5"></i>
          Appeal: {persona?.appeal_how_to || "Appeal strategies"}
        </p>
      </div>
    </div>;
};
export default Persona1;