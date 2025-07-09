import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Brain, Lock, Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Persona1 = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Persona 1</h1>
        <p className="text-muted-foreground mt-2">Creative</p>
      </div>

      <Card className="max-w-4xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Location:</h3>
                </div>
                <p className="text-sm text-foreground">New York, Los Angeles</p>
                <p className="text-sm text-muted-foreground">Large, metropolitan coastal city</p>
              </div>

              {/* Psychographics */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Psychographics:</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This persona is interested in home design and is looking for budget-friendly solutions to improve their living space.
                </p>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Age Range:</h4>
                  <p className="text-sm text-muted-foreground">25-34</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <h4 className="font-medium text-foreground">Gender:</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Female</p>
                </div>
              </div>

              {/* Unlock Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Unlock for:</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="seo" />
                    <label htmlFor="seo" className="text-sm text-muted-foreground">SEO Keywords</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="competitor" />
                    <label htmlFor="competitor" className="text-sm text-muted-foreground">Competitor Analysis</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cac" />
                    <label htmlFor="cac" className="text-sm text-muted-foreground">Estimated CAC</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ltv" />
                    <label htmlFor="ltv" className="text-sm text-muted-foreground">Estimated LTV</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="appeal" />
                    <label htmlFor="appeal" className="text-sm text-muted-foreground">How to appeal to persona</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Social Media Platforms */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Social Media Platforms:</h3>
                <div className="flex justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-2">
                      f
                    </div>
                    <Checkbox />
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-2">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white mb-2">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43Z"/>
                      </svg>
                    </div>
                    <Checkbox />
                  </div>
                </div>
              </div>

              {/* Generate Ad Content Button */}
              <div className="flex justify-center">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Ad Content
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Persona1;