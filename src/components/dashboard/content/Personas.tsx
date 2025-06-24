
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Briefcase, Sparkles, Save } from "lucide-react";
import { usePersonas } from "@/hooks/usePersonas";

const Personas = () => {
  const { personas, isLoading, isSaving, generatePersonas, savePersonas } = usePersonas();
  const [hasGenerated, setHasGenerated] = useState(false);

  // Default placeholder personas to show initially
  const defaultPersonas = [
    {
      name: "The Ambitious Entrepreneur",
      description: "Small business owners who are growth-focused and tech-savvy",
      demographics: "Ages 28-45, college-educated, urban/suburban",
      painPoints: "Limited time, need quick wins, budget constraints",
      goals: "Scale business, increase revenue, build brand awareness",
      preferredChannels: "LinkedIn, Facebook, Instagram",
      buyingMotivation: "ROI and efficiency",
      contentPreferences: "How-to guides, success stories, industry insights"
    },
    {
      name: "The Community Builder", 
      description: "Local business owners focused on community engagement",
      demographics: "Ages 35-55, established in community, family-oriented",
      painPoints: "Keeping up with digital trends, connecting with younger customers",
      goals: "Build loyal customer base, strengthen community ties",
      preferredChannels: "Facebook, Local platforms, Email",
      buyingMotivation: "Trust and relationships",
      contentPreferences: "Community stories, testimonials, local events"
    },
    {
      name: "The Digital Native",
      description: "Young entrepreneurs comfortable with digital marketing",
      demographics: "Ages 22-35, highly educated, early adopters",
      painPoints: "Standing out in crowded market, converting followers to customers",
      goals: "Viral growth, brand differentiation, customer acquisition",
      preferredChannels: "Instagram, TikTok, Twitter",
      buyingMotivation: "Innovation and trends",
      contentPreferences: "Visual content, behind-the-scenes, trending topics"
    }
  ];

  const displayPersonas = personas.length > 0 ? personas : defaultPersonas;
  const isUsingAIPersonas = personas.length > 0;

  const handleRegeneratePersonas = async () => {
    const success = await generatePersonas();
    if (success) {
      setHasGenerated(true);
    }
  };

  const handleSavePersonas = async () => {
    await savePersonas();
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Personas</h1>
        <p className="text-muted-foreground">
          {isUsingAIPersonas 
            ? "Your AI-generated personas based on your company profile to target your ideal customers."
            : "Sample personas shown below. Click 'Generate Personas' to create personalized ones based on your company profile."
          }
        </p>
      </div>

      {!isUsingAIPersonas && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                These are sample personas. Generate personalized ones based on your company profile!
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {displayPersonas.map((persona, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getPersonaColor(index)} text-white`}>
                  {getPersonaIcon(index)}
                </div>
                <div>
                  <CardTitle className="text-lg">{persona.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {persona.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-foreground mb-2">Demographics</h4>
                <p className="text-sm text-muted-foreground">{persona.demographics}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-foreground mb-2">Pain Points</h4>
                <p className="text-sm text-muted-foreground">{persona.painPoints}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-foreground mb-2">Goals</h4>
                <p className="text-sm text-muted-foreground">{persona.goals}</p>
              </div>

              {isUsingAIPersonas && (
                <>
                  <div>
                    <h4 className="font-medium text-sm text-foreground mb-2">Preferred Channels</h4>
                    <p className="text-sm text-muted-foreground">{persona.preferredChannels}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-foreground mb-2">Buying Motivation</h4>
                    <p className="text-sm text-muted-foreground">{persona.buyingMotivation}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-foreground mb-2">Content Preferences</h4>
                    <p className="text-sm text-muted-foreground">{persona.contentPreferences}</p>
                  </div>
                </>
              )}
              
              <Button variant="outline" size="sm" className="w-full">
                Create Content for This Persona
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Persona Management
          </CardTitle>
          <CardDescription>
            {isUsingAIPersonas 
              ? "Manage your AI-generated marketing personas."
              : "Generate personalized marketing personas based on your company profile."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-x-3">
          <Button 
            className="bg-fabel-primary hover:bg-fabel-primary/90"
            onClick={handleRegeneratePersonas}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : isUsingAIPersonas ? "Regenerate Personas" : "Generate Personas"}
          </Button>
          {isUsingAIPersonas && (
            <Button 
              variant="outline"
              onClick={handleSavePersonas}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Personas"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Personas;
