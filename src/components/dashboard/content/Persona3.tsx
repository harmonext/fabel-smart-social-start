import React, { useState } from "react";
import { Instagram, Twitter, Tv } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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

const Persona3 = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEditingPlatform, setCurrentEditingPlatform] = useState<string | null>(null);
  const [modalText, setModalText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const platformData: Record<string, PlatformData> = {
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-[#E4405F]',
      content: `🌟 Ready to disrupt the market? Your creative vision deserves a platform that keeps up! ✨ Join the digital revolution with tools built for innovators like you. #DigitalNative #Innovation #CreativeEntrepreneur`,
    },
    twitter: {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'text-brand-dark',
      content: `🚀 The future belongs to digital natives who dare to innovate! Are you ready to turn your creative ideas into viral success? Join the movement! #Innovation #DigitalMarketing #Entrepreneur`,
    },
    tiktok: {
      name: 'TikTok',
      icon: Tv,
      color: 'text-brand-dark',
      content: `POV: You're tired of outdated marketing strategies 🎯 Finally, a platform that speaks your language! Built for creators, by creators. Ready to go viral? #CreativeLife #DigitalMarketing #Innovation`,
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
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
      setGeneratedContent(prev => 
        prev.map(content => 
          content.platform === currentEditingPlatform 
            ? { ...content, text: modalText }
            : content
        )
      );
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
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-muted rounded-lg p-6 space-y-4 h-full flex flex-col">
      <div>
        <h1 className="text-lg font-bold text-muted-foreground">Persona 3</h1>
        <p className="text-sm font-medium text-muted-foreground">Lorem</p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-2">Social Media Platforms:</h2>
        <div className="flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <Instagram className="w-6 h-6 text-[#E4405F]" />
            <Checkbox disabled />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Twitter className="w-6 h-6 text-brand-dark" />
            <Checkbox disabled />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Tv className="w-6 h-6 text-brand-dark" />
            <Checkbox disabled />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-1">Location:</h2>
        <p className="text-xs text-muted-foreground">
          Lorem ipsum, lorem ipsum<br />
          Lorem ipsum lorem ipsum
        </p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-1">Psychographics:</h2>
        <p className="text-xs text-muted-foreground">
          Lorem ipsum, lorem ipsum, lorem ipsum, lorem ipsum Lorem ipsum, lorem ipsum
        </p>
      </div>

      <div className="flex justify-center space-x-8">
        <div className="text-center">
          <h2 className="font-bold text-sm">Age Range:</h2>
          <p className="text-xs text-muted-foreground">18-25</p>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-sm">Gender:</h2>
          <p className="text-xs text-muted-foreground">Female</p>
        </div>
      </div>

      <div className="pt-2 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <i className="fa-solid fa-lock text-lg text-muted-foreground"></i>
          <h2 className="font-bold text-sm">Unlock for:</h2>
        </div>
        <ul className="list-none space-y-1 text-xs text-muted-foreground">
          <li>SEO Keywords</li>
          <li>Competitor Analysis</li>
          <li>Estimated CAC</li>
          <li>Estimated LTV</li>
          <li>How to appeal to persona</li>
        </ul>
      </div>
    </div>
  );
};

export default Persona3;