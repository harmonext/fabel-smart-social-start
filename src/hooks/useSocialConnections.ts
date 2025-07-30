import { useState, useEffect } from 'react';

export interface SocialConnection {
  name: string;
  connected: boolean;
  account: string;
  followers: string;
  platform: string; // normalized platform name for matching
}

export const useSocialConnections = () => {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - in a real app this would come from the database
    const mockConnections: SocialConnection[] = [
      {
        name: "Facebook",
        connected: true,
        account: "@acmemarketing",
        followers: "2.1K",
        platform: "facebook"
      },
      {
        name: "Instagram",
        connected: true,
        account: "@acme_marketing",
        followers: "1.8K",
        platform: "instagram"
      },
      {
        name: "Twitter/X",
        connected: false,
        account: "",
        followers: "",
        platform: "twitter"
      },
      {
        name: "LinkedIn",
        connected: true,
        account: "Acme Marketing Solutions",
        followers: "856",
        platform: "linkedin"
      },
      {
        name: "Pinterest",
        connected: true,
        account: "@acme_designs",
        followers: "3.2K",
        platform: "pinterest"
      },
      {
        name: "TikTok",
        connected: false,
        account: "",
        followers: "",
        platform: "tiktok"
      }
    ];
    
    setConnections(mockConnections);
    setIsLoading(false);
  }, []);

  const getConnectedPlatforms = () => {
    return connections.filter(conn => conn.connected).map(conn => conn.platform);
  };

  return {
    connections,
    isLoading,
    getConnectedPlatforms
  };
};