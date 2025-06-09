
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Briefcase } from "lucide-react";

const Personas = () => {
  const personas = [
    {
      id: 1,
      name: "The Ambitious Entrepreneur",
      icon: <Briefcase className="h-6 w-6" />,
      description: "Small business owners who are growth-focused and tech-savvy",
      demographics: "Ages 28-45, college-educated, urban/suburban",
      painPoints: "Limited time, need quick wins, budget constraints",
      goals: "Scale business, increase revenue, build brand awareness",
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "The Community Builder",
      icon: <Heart className="h-6 w-6" />,
      description: "Local business owners focused on community engagement",
      demographics: "Ages 35-55, established in community, family-oriented",
      painPoints: "Keeping up with digital trends, connecting with younger customers",
      goals: "Build loyal customer base, strengthen community ties",
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "The Digital Native",
      icon: <Target className="h-6 w-6" />,
      description: "Young entrepreneurs comfortable with digital marketing",
      demographics: "Ages 22-35, highly educated, early adopters",
      painPoints: "Standing out in crowded market, converting followers to customers",
      goals: "Viral growth, brand differentiation, customer acquisition",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Personas</h1>
        <p className="text-muted-foreground">AI-generated personas based on your company profile to target your ideal customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <Card key={persona.id} className="relative">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${persona.color} text-white`}>
                  {persona.icon}
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
            Manage and customize your marketing personas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-x-3">
          <Button className="bg-fabel-primary hover:bg-fabel-primary/90">
            Regenerate Personas
          </Button>
          <Button variant="outline">
            Customize Personas
          </Button>
          <Button variant="outline">
            Export Personas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Personas;
