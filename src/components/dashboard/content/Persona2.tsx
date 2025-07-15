import React, { useState } from "react";
import { Linkedin, Twitter, Youtube } from "lucide-react";
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

const Persona2 = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEditingPlatform, setCurrentEditingPlatform] = useState<string | null>(null);
  const [modalText, setModalText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const platformData: Record<string, PlatformData> = {
    linkedin: {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-[#0077B5]',
      content: `Looking to advance your career? Our professional development programs help ambitious professionals like you reach the next level. Connect with industry leaders and unlock your potential. #CareerGrowth #ProfessionalDevelopment #Leadership`,
    },
    twitter: {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'text-brand-dark',
      content: `🚀 Ready to level up your career game? Our mentorship programs connect you with top executives who've been where you want to go. Apply now! #CareerGoals #Mentorship #Success`,
    },
    youtube: {
      name: 'YouTube',
      icon: Youtube,
      color: 'text-[#FF0000]',
      content: `Watch how our alumni went from entry-level to C-suite in just 5 years! Get the insider strategies that transformed their careers. Subscribe for more success stories! #CareerTransformation #ExecutiveCoaching`,
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
        <h1 className="text-lg font-bold text-foreground line-through">Persona 2</h1>
        <p className="text-sm font-medium text-muted-foreground line-through">Lorem</p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-2">Social Media Platforms:</h2>
        <div className="flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <Linkedin className="w-6 h-6 text-[#0077B5]" />
            <Checkbox disabled />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Twitter className="w-6 h-6 text-brand-dark" />
            <Checkbox disabled />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Youtube className="w-6 h-6 text-[#FF0000]" />
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
          <p className="text-xs text-muted-foreground">34-45</p>
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

export default Persona2;