import React, { useState } from "react";
import { Share2, Sparkles, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Persona, usePersonas } from "@/hooks/usePersonas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


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
  const { savePersonas } = usePersonas();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEditingPlatform, setCurrentEditingPlatform] = useState<string | null>(null);
  const [modalText, setModalText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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
        return { icon: () => <SocialIcon className="fab fa-twitter text-brand-dark" />, color: 'text-brand-dark', name: 'Twitter/X' };
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
      icon: () => <i className="fab fa-twitter" />,
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
  };

  const handlePlatformActiveToggle = async (platformIndex: number, isActive: boolean) => {
    if (!persona) return;
    
    try {
      // Update the persona in the database
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Authentication error");
        return;
      }

      // Determine which field to update based on the platform index
      let updateField: string;
      switch (platformIndex) {
        case 0:
          updateField = 'social_media_top_1_active';
          break;
        case 1:
          updateField = 'social_media_top_2_active';
          break;
        case 2:
          updateField = 'social_media_top_3_active';
          break;
        default:
          return;
      }

      const { error } = await supabase
        .from('saved_personas')
        .update({ [updateField]: isActive })
        .eq('user_id', user.id)
        .eq('name', persona.name);

      if (error) {
        console.error('Error updating platform active state:', error);
        toast.error("Failed to update platform state");
        return;
      }

      // Update the local persona object
      if (platformIndex === 0) {
        persona.social_media_top_1_active = isActive;
      } else if (platformIndex === 1) {
        persona.social_media_top_2_active = isActive;
      } else if (platformIndex === 2) {
        persona.social_media_top_3_active = isActive;
      }

      toast.success(`Platform ${isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating platform active state:', error);
      toast.error("Failed to update platform state");
    }
  };


  const handleGenerateContentClick = async () => {
    const personaName = persona?.name || "The Ambitious Entrepreneur";
    
    console.log('Persona object:', persona);
    console.log('Persona name:', personaName);
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { personaName }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success(`Generated ${data.contentGenerated} social media posts!`);
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error.message || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Close button */}
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Embedded Normal View */}
              <div className="lg:col-span-1">
                <div className="bg-muted rounded-lg p-6 space-y-4 h-full flex flex-col">
                  {/* Normal View Header */}
                  <div className="flex items-center gap-3">
                    <div>
                      <h1 className="text-lg font-bold text-foreground">{persona?.name || "Urban Creative"}</h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        {persona?.description || "Barry is a savvy shopper who prioritizes value without compromising quality. He enjoys finding deals and is often seen researching products online before making a purchase."}
                      </p>
                    </div>
                  </div>

                  {/* Age, Gender, Income */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <div className="bg-card px-3 py-1 rounded-full text-xs font-medium">
                      {persona?.age_ranges || "28-37 YEARS OLD"}
                    </div>
                    <div className="bg-card px-3 py-1 rounded-full text-xs font-medium">
                      {persona?.genders || "FEMALE"}
                    </div>
                  </div>

                  {/* Income */}
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-block">
                      {persona?.income_level || "$75K - $125K"}
                    </div>
                  </div>

                  {/* Social Media Icons */}
                  <div className="text-center">
                    <TooltipProvider>
                      <div className="flex items-center justify-center space-x-6">
                        {socialMediaPlatforms.slice(0, 3).map((platform, index) => {
                          const { icon: Icon, color, name } = getSocialMediaIcon(platform);
                          const isActive = index === 0 ? persona?.social_media_top_1_active : 
                                          index === 1 ? persona?.social_media_top_2_active : 
                                          persona?.social_media_top_3_active;
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
                               <Checkbox
                                 checked={isActive === true}
                                 onCheckedChange={(checked) => handlePlatformActiveToggle(index, checked as boolean)}
                               />
                            </div>
                          );
                        })}
                      </div>
                    </TooltipProvider>
                  </div>

                  {/* Location */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                      {persona?.location || "Portland, Oregon | San Francisco, California | Austin, Texas"}
                    </p>
                  </div>

                  <div className="flex-1"></div>
                  <div className="pt-4">
                    <Button 
                      className="bg-fabel-primary hover:bg-fabel-primary/90 w-full"
                      onClick={handleGenerateContentClick}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate Content"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Columns - Expanded Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Psychographics and Upgrade to Unlock side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Psychographics */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">PSYCHOGRAPHICS</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Values craftsmanship, design integrity, and subtle status symbols</li>
                      <li>• Seeks individuality and authenticity in personal style</li>
                      <li>• Often shops from brands with a story, ethics, or sustainable practices</li>
                      <li>• Believes that accessories are statements, not just add-ons</li>
                    </ul>
                  </div>

                  {/* Upgrade to Unlock */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fa-solid fa-lock text-foreground"></i>
                      <span className="font-bold text-sm">Upgrade to Unlock:</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-green-100 rounded p-2">
                        <div className="text-xs font-semibold text-green-800">ESTIMATED LTV</div>
                        <div className="text-sm text-muted-foreground">~$600-$900</div>
                      </div>
                      <div className="bg-green-100 rounded p-2">
                        <div className="text-xs font-semibold text-green-800">ESTIMATED CAC</div>
                        <div className="text-sm text-muted-foreground">~$70</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Upgrade to Unlock */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fa-solid fa-lock text-foreground"></i>
                    <span className="font-bold text-sm">Upgrade to Unlock:</span>
                  </div>
                </div>

                {/* Three columns section */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <h4 className="font-bold text-sm text-green-600 mb-2">COMPETITORS</h4>
                      <div className="space-y-1 text-xs">
                        <div>CUYANA</div>
                        <div>POLÈNE</div>
                        <div className="text-muted-foreground">MANSUR GAVRIEL</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-orange-600 mb-2 text-left">PAIN POINTS</h4>
                      <ul className="space-y-1 text-xs text-left">
                        <li>• Fatigue with overexposed "it" brands</li>
                        <li>• Lack of unique, high-quality options that align with values</li>
                        <li>• Overpriced designer goods with unclear origin</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-purple-600 mb-2 text-left">HOW TO APPEAL</h4>
                      <ul className="space-y-1 text-xs text-left">
                        <li>• Focus on storytelling: emphasize the materials, artisans, and heritage behind each item</li>
                        <li>• Highlight sustainable practices and slow fashion ethos</li>
                        <li>• Collaborate with style influencers and micro-creatives in art/fashion</li>
                        <li>• Offer limited runs or customizable options</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Progress Overlay for expanded view */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-6 shadow-2xl max-w-sm mx-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-fabel-primary rounded-full flex items-center justify-center animate-pulse-gentle">
                    <Sparkles className="h-6 w-6 text-white animate-spin-slow" />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-fabel-primary/30 rounded-full animate-spin-slow"></div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Generating Content</h3>
                  <p className="text-xs text-muted-foreground">
                    Creating social media posts for {persona?.name || "this persona"}...
                  </p>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-fabel-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative bg-muted rounded-lg p-6 space-y-4 flex flex-col">
      {/* Progress Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-6 shadow-2xl max-w-sm mx-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Animated Icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-fabel-primary rounded-full flex items-center justify-center animate-pulse-gentle">
                  <Sparkles className="h-6 w-6 text-white animate-spin-slow" />
                </div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-fabel-primary/30 rounded-full animate-spin-slow"></div>
              </div>
              
              {/* Progress Text */}
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Generating Content
                </h3>
                <p className="text-xs text-muted-foreground">
                  Creating social media posts for {persona?.name || "this persona"}...
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-fabel-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular View Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">{persona?.name || "Urban Creative"}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            More <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {persona?.description || "Barry is a savvy shopper who prioritizes value without compromising quality. He enjoys finding deals and is often seen researching products online before making a purchase."}
        </p>
      </div>

      {/* Age, Gender, Income */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="bg-card px-3 py-1 rounded-full text-xs font-medium">
          {persona?.age_ranges || "28-37 YEARS OLD"}
        </div>
        <div className="bg-card px-3 py-1 rounded-full text-xs font-medium">
          {persona?.genders || "FEMALE"}
        </div>
      </div>

      {/* Income */}
      <div className="text-center">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-block">
          {persona?.income_level || "$75K - $125K"}
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="text-center">
        <TooltipProvider>
          <div className="flex items-center justify-center space-x-6">
            {socialMediaPlatforms.slice(0, 3).map((platform, index) => {
              const { icon: Icon, color, name } = getSocialMediaIcon(platform);
              const isActive = index === 0 ? persona?.social_media_top_1_active : 
                              index === 1 ? persona?.social_media_top_2_active : 
                              persona?.social_media_top_3_active;
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
                   <Checkbox
                     checked={isActive === true}
                     onCheckedChange={(checked) => handlePlatformActiveToggle(index, checked as boolean)}
                   />
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Location */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-medium">
          {persona?.location || "Portland, Oregon | San Francisco, California | Austin, Texas"}
        </p>
      </div>

      <div className="flex-1"></div>
      <div className="pt-4">
        <Button 
          className="bg-fabel-primary hover:bg-fabel-primary/90 w-full"
          onClick={handleGenerateContentClick}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Content"}
        </Button>
      </div>
    </div>
  );
};

export default Persona1;
