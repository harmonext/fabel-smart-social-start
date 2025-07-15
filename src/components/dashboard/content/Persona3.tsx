import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Heart, Briefcase, Edit, Upload, X } from "lucide-react";

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

const Persona3 = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<string>("");
  const [modalText, setModalText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const platformData: Record<string, PlatformData> = {
    facebook: {
      name: "Facebook",
      icon: "📘",
      color: "bg-blue-600",
      content: "🎯 Ready to take your entrepreneurial journey to the next level? \n\nAs a creative professional, you understand the power of innovation and community. That's why our platform is designed specifically for forward-thinking entrepreneurs like you who value authentic connections and cutting-edge solutions.\n\n✨ Join thousands of creative entrepreneurs who are already transforming their businesses with our innovative tools.\n\n#Entrepreneurship #CreativeInnovation #CommunityDriven"
    },
    instagram: {
      name: "Instagram", 
      icon: "📷",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      content: "🌟 For the creative minds who dare to disrupt! \n\n💡 Innovation meets community in the most beautiful way\n🎨 Designed by creatives, for creatives\n🚀 Your next breakthrough starts here\n\nDouble tap if you're ready to revolutionize your creative business! 👇\n\n#CreativeEntrepreneur #Innovation #Community #CreativeLife #Entrepreneurship"
    },
    tiktok: {
      name: "TikTok",
      icon: "🎵", 
      color: "bg-black",
      content: "POV: You're a creative entrepreneur who's tired of cookie-cutter solutions 🎨\n\n✨ Finally, a platform that gets YOUR vibe\n🔥 Built for the rebels and innovators  \n💫 Where creativity meets strategy\n\nComment 'CREATIVE' if you're ready to join the revolution! 👇\n\n#CreativeEntrepreneur #Innovation #Startup #Creative #Entrepreneur #SmallBusiness"
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
    const content = generatedContent.find(c => c.platform === platform);
    setEditingPlatform(platform);
    setModalText(content?.text || "");
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    setGeneratedContent(prev => 
      prev.map(content => 
        content.platform === editingPlatform 
          ? { ...content, text: modalText }
          : content
      )
    );
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlatform("");
    setModalText("");
    setImageFile(null);
    setImagePreview("");
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Persona 3: The Digital Native</h1>
        <p className="text-muted-foreground mb-6">
          Young entrepreneurs comfortable with digital marketing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Persona Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500 text-white">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">The Digital Native</CardTitle>
                <CardDescription className="text-sm">
                  Young entrepreneurs comfortable with digital marketing
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Demographics</h4>
              <p className="text-sm text-muted-foreground">Ages 22-35, highly educated, early adopters</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Pain Points</h4>
              <p className="text-sm text-muted-foreground">Standing out in crowded market, converting followers to customers</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Goals</h4>
              <p className="text-sm text-muted-foreground">Viral growth, brand differentiation, customer acquisition</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Preferred Channels</h4>
              <p className="text-sm text-muted-foreground">Instagram, TikTok, Twitter</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Buying Motivation</h4>
              <p className="text-sm text-muted-foreground">Innovation and trends</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Content Preferences</h4>
              <p className="text-sm text-muted-foreground">Visual content, behind-the-scenes, trending topics</p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Platforms for Ad Content</CardTitle>
            <CardDescription>
              Choose which social media platforms you'd like to create ad content for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(platformData).map(([platform, data]) => (
              <div key={platform} className="flex items-center space-x-3">
                <Checkbox
                  id={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onCheckedChange={() => handlePlatformToggle(platform)}
                />
                <Label 
                  htmlFor={platform} 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-lg">{data.icon}</span>
                  <span>{data.name}</span>
                </Label>
              </div>
            ))}
            
            <Button 
              className="w-full mt-6"
              onClick={handleGenerateContent}
              disabled={selectedPlatforms.length === 0 || isGenerating}
            >
              {isGenerating ? "Generating Ad Content..." : "Generate Ad Content"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Generated Ad Content</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedContent.map((content) => {
              const platformInfo = platformData[content.platform];
              return (
                <Card key={content.platform}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{platformInfo.icon}</span>
                        <CardTitle className="text-lg">{platformInfo.name} Ad</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContent(content.platform)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{content.text}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editingPlatform && platformData[editingPlatform]?.name} Ad Content
            </DialogTitle>
            <DialogDescription>
              Customize your ad content and upload an image if needed
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ad-text">Ad Text</Label>
              <Textarea
                id="ad-text"
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                rows={8}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="ad-image">Ad Image (Optional)</Label>
              <div className="mt-1">
                <Input
                  id="ad-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Persona3;