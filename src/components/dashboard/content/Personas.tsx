import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, Heart, Briefcase, Sparkles, Save } from "lucide-react";
import { usePersonas } from "@/hooks/usePersonas";
import Persona1 from "./Persona1";
import Persona2 from "./Persona2";
import Persona3 from "./Persona3";
const Personas = () => {
  const {
    personas,
    isLoading,
    isSaving,
    generatePersonas,
    savePersonas
  } = usePersonas();
  const [hasGenerated, setHasGenerated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Default placeholder personas to show initially
  const defaultPersonas = [{
    name: "The Ambitious Entrepreneur",
    description: "Small business owners who are growth-focused and tech-savvy",
    demographics: "Ages 28-45, college-educated, urban/suburban",
    painPoints: "Limited time, need quick wins, budget constraints",
    goals: "Scale business, increase revenue, build brand awareness",
    preferredChannels: "LinkedIn, Facebook, Instagram",
    buyingMotivation: "ROI and efficiency",
    contentPreferences: "How-to guides, success stories, industry insights"
  }, {
    name: "The Community Builder",
    description: "Local business owners focused on community engagement",
    demographics: "Ages 35-55, established in community, family-oriented",
    painPoints: "Keeping up with digital trends, connecting with younger customers",
    goals: "Build loyal customer base, strengthen community ties",
    preferredChannels: "Facebook, Local platforms, Email",
    buyingMotivation: "Trust and relationships",
    contentPreferences: "Community stories, testimonials, local events"
  }, {
    name: "The Digital Native",
    description: "Young entrepreneurs comfortable with digital marketing",
    demographics: "Ages 22-35, highly educated, early adopters",
    painPoints: "Standing out in crowded market, converting followers to customers",
    goals: "Viral growth, brand differentiation, customer acquisition",
    preferredChannels: "Instagram, TikTok, Twitter",
    buyingMotivation: "Innovation and trends",
    contentPreferences: "Visual content, behind-the-scenes, trending topics"
  }];
  const displayPersonas = personas.length > 0 ? personas : defaultPersonas;
  const isUsingAIPersonas = personas.length > 0;
  const handleRegeneratePersonas = async () => {
    const success = await generatePersonas();
    if (success) {
      setHasGenerated(true);
      setHasSaved(false); // Reset saved state when new personas are generated
    }
  };
  const handleSavePersonas = async () => {
    const success = await savePersonas();
    if (success) {
      setHasSaved(true);
    }
  };
  const getPersonaIcon = (index: number) => {
    const icons = [<Briefcase className="h-6 w-6" />, <Heart className="h-6 w-6" />, <Target className="h-6 w-6" />];
    return icons[index] || <Users className="h-6 w-6" />;
  };
  const getPersonaColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];
    return colors[index] || "bg-gray-500";
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      {/* Progress Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-8 shadow-2xl max-w-md mx-4">
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Icon */}
              <div className="relative">
                <div className="w-16 h-16 bg-fabel-primary rounded-full flex items-center justify-center animate-pulse-gentle">
                  <Sparkles className="h-8 w-8 text-white animate-spin-slow" />
                </div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-fabel-primary/30 rounded-full animate-spin-slow"></div>
              </div>
              
              {/* Progress Text */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Generating Personas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Creating personalized marketing personas based on your company profile...
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div className="h-full bg-fabel-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Persona Management
            </CardTitle>
            <CardDescription>
              {isUsingAIPersonas ? "Manage your AI-generated marketing personas." : "Generate personalized marketing personas based on your company profile."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-fabel-primary hover:bg-fabel-primary/90" onClick={handleRegeneratePersonas} disabled={isLoading}>
                {isLoading ? "Generating..." : isUsingAIPersonas ? "Regenerate Personas" : "Generate Personas"}
              </Button>
              {isUsingAIPersonas && <Button 
                  variant="outline" 
                  onClick={handleSavePersonas} 
                  disabled={isSaving || !hasGenerated || hasSaved} 
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : hasSaved ? "Saved" : "Save Personas"}
                </Button>}
            </div>
          </CardContent>
        </Card>

        {/* Persona Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <Persona1 persona={displayPersonas[0]} />
          <Persona2 persona={displayPersonas[1]} />
          <Persona3 persona={displayPersonas[2]} />
        </div>
      </div>
    </div>
  );
};
export default Personas;