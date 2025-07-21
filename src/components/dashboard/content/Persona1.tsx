import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
interface PlatformData {
  name: string;
  icon: string;
  color: string;
  content: string;
}
interface GeneratedContent {
  platform: string;
  text: string;
}
const Persona1 = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEditingPlatform, setCurrentEditingPlatform] = useState<string | null>(null);
  const [modalText, setModalText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const platformData: Record<string, PlatformData> = {
    facebook: {
      name: 'Facebook',
      icon: 'fa-brands fa-facebook',
      color: 'text-[#1877F2]',
      content: `Transform your space on a budget! ✨ Discover our new collection of affordable home decor that looks anything but. #HomeDesign #BudgetFriendly #LivingSpace`
    },
    instagram: {
      name: 'Instagram',
      icon: 'fa-brands fa-instagram',
      color: 'text-[#E4405F]',
      content: `Dreaming of a home makeover? 🏡 Our latest pieces are here to make it a reality without breaking the bank. Tap to shop! #HomeDecor #InteriorInspo #AffordableLuxury`
    },
    tiktok: {
      name: 'TikTok',
      icon: 'fa-brands fa-tiktok',
      color: 'text-brand-dark',
      content: `Watch how we turn a boring room into a cozy paradise with our new budget-friendly decor! 🤩 #HomeDecorHacks #DIY #RoomTransformation`
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
        <h1 className="text-lg font-bold text-foreground">Persona Name</h1>
        <p className="text-sm font-medium text-muted-foreground">[[description]]</p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-2">Social Media Platforms:</h2>
        <div className="flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <i className="fa-brands fa-facebook text-2xl text-[#1877F2]"></i>
            <Checkbox />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <i className="fa-brands fa-instagram text-2xl text-[#E4405F]"></i>
            <Checkbox />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <i className="fa-brands fa-tiktok text-2xl text-brand-dark"></i>
            <Checkbox />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-1">Location:</h2>
        <p className="text-xs text-muted-foreground">
          [[location]]
        </p>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-sm mb-1">Psychographics:</h2>
        <p className="text-xs text-muted-foreground">
          [[psychographics]]
        </p>
      </div>

      <div className="flex justify-center space-x-8">
        <div className="text-center">
          <h2 className="font-bold text-sm">Age Range:</h2>
          <p className="text-xs text-muted-foreground">25-34</p>
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
          <li>Major Competitors</li>
          <li>Estimated CAC</li>
          <li>Estimated LTV</li>
          <li>How to appeal to persona</li>
        </ul>
      </div>
    </div>;
};
export default Persona1;