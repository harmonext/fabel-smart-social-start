
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Heart, Briefcase, Sparkles, Save, User, MapPin, Brain, Lock, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { usePersonas } from "@/hooks/usePersonas";

const Personas = () => {
  const { personas, isLoading, isSaving, generatePersonas, savePersonas } = usePersonas();
  const [hasGenerated, setHasGenerated] = useState(false);

  const isUsingAIPersonas = personas.length > 0;

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('facebook')) return <Facebook className="h-4 w-4" />;
    if (platformLower.includes('instagram')) return <Instagram className="h-4 w-4" />;
    if (platformLower.includes('twitter') || platformLower.includes('x')) return <Twitter className="h-4 w-4" />;
    if (platformLower.includes('linkedin')) return <Linkedin className="h-4 w-4" />;
    if (platformLower.includes('youtube')) return <Youtube className="h-4 w-4" />;
    return <div className="h-4 w-4 bg-gray-300 rounded" />;
  };

  const renderPersonaCard = (persona: any, index: number, isUpgrade = false) => {
    return (
      <Card key={index} className="relative overflow-hidden">
        {isUpgrade && (
          <Badge className="absolute top-3 right-3 bg-orange-100 text-orange-800 hover:bg-orange-100">
            Upgrade
          </Badge>
        )}
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{persona.name}</h3>
              <p className="text-sm text-gray-600">{persona.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Social Media Platforms:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {persona.preferredChannels ? persona.preferredChannels.split(',').slice(0, 3).map((channel: string, idx: number) => (
                  <div key={idx} className="w-8 h-8 rounded border flex items-center justify-center bg-blue-50">
                    {getSocialIcon(channel.trim())}
                  </div>
                )) : (
                  <>
                    <div className="w-8 h-8 rounded border flex items-center justify-center bg-blue-50">
                      <Facebook className="h-4 w-4" />
                    </div>
                    <div className="w-8 h-8 rounded border flex items-center justify-center bg-pink-50">
                      <Instagram className="h-4 w-4" />
                    </div>
                    <div className="w-8 h-8 rounded border flex items-center justify-center bg-gray-50">
                      <Twitter className="h-4 w-4" />
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded border border-dashed border-gray-300" />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Location:</h4>
              <p className="text-sm text-blue-600">{persona.demographics || "New York, Los Angeles"}</p>
              <p className="text-xs text-gray-500">Large, metropolitan coastal city</p>
            </div>

            {persona.painPoints && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Psychographics:</h4>
                <p className="text-xs text-gray-600">{persona.painPoints}</p>
              </div>
            )}

            <div className="flex gap-8 text-sm">
              <div>
                <span className="font-medium text-gray-900">Age Range:</span>
                <p className="text-gray-600">25-34</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Gender:</span>
                <p className="text-gray-600">Female</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Unlock for:</span>
              </div>
              <ul className="list-none space-y-1 text-xs text-gray-600">
                <li>SEO Keywords</li>
                <li>Major Competitors</li>
                <li>Estimated CAC</li>
                <li>Estimated LTV</li>
                <li>How to appeal to persona</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleRegeneratePersonas = async () => {
    const success = await generatePersonas();
    if (success) {
      setHasGenerated(true);
    }
  };

  const handleSavePersonas = async () => {
    await savePersonas();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Personas</h1>
        <p className="text-muted-foreground">
          {isUsingAIPersonas 
            ? "Your AI-generated personas based on your company profile to target your ideal customers."
            : "Sample personas shown below. Click 'Generate Personas' to create personalized ones based on your company profile."
          }
        </p>
      </div>

      <div className="space-y-6">
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
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
          </CardContent>
        </Card>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {isUsingAIPersonas ? (
            personas.slice(0, 3).map((persona, index) => 
              renderPersonaCard(persona, index, index === 1)
            )
          ) : (
            // Show placeholder personas when no AI personas are available
            [
              {
                name: "Persona Name",
                description: "Description",
                preferredChannels: "Facebook, Instagram, Twitter",
                demographics: "New York, Los Angeles"
              },
              {
                name: "Persona Name", 
                description: "Description",
                preferredChannels: "LinkedIn, Twitter, Youtube",
                demographics: "Lorem ipsum, lorem ipsum Lorem ipsum lorem ipsum"
              },
              {
                name: "Persona Name",
                description: "Description", 
                preferredChannels: "Instagram, Twitter",
                demographics: "Lorem ipsum, lorem ipsum Lorem ipsum lorem ipsum"
              }
            ].map((persona, index) => 
              renderPersonaCard(persona, index, index === 1)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Personas;
