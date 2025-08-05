import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SocialConnection {
  id: string;
  platform: string;
  platform_user_id: string;
  account_name: string;
  followers_count: number;
  access_token: string;
  is_active: boolean;
  connected_at: string;
  last_sync_at: string | null;
}

export const useSocialConnections = () => {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchConnections = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      const realConnections = data || [];
      
      // Mock Facebook connection for testing
      const mockFacebookConnection: SocialConnection = {
        id: 'mock-facebook-id',
        platform: 'facebook',
        platform_user_id: 'mock-facebook-user-123',
        account_name: 'Test Facebook Page',
        followers_count: 15420,
        access_token: 'mock-token',
        is_active: true,
        connected_at: new Date().toISOString(),
        last_sync_at: new Date().toISOString()
      };

      // Add mock connection if Facebook isn't already connected
      const hasFacebook = realConnections.some(conn => conn.platform === 'facebook');
      const allConnections = hasFacebook ? realConnections : [...realConnections, mockFacebookConnection];

      setConnections(allConnections);
    } catch (err) {
      console.error('Error fetching social connections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch connections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  const connectPlatform = async (platform: string): Promise<string> => {
    const redirectUri = `${window.location.origin}/dashboard?tab=social&subtab=connections`;
    
    switch (platform) {
      case 'facebook':
        const facebookAppId = "1062833901736033"; // Replace with your actual Facebook App ID
        return `https://www.facebook.com/v18.0/dialog/oauth?` +
          `client_id=${facebookAppId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=pages_manage_posts,pages_read_engagement,pages_show_list&` +
          `response_type=code&` +
          `state=${user?.id}_${platform}`;
      
      case 'instagram':
        const instagramAppId = "1062833901736033"; // Same as Facebook for Instagram Business
        return `https://www.facebook.com/v18.0/dialog/oauth?` +
          `client_id=${instagramAppId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=instagram_basic,instagram_content_publish&` +
          `response_type=code&` +
          `state=${user?.id}_${platform}`;
      
      case 'twitter':
        const twitterClientId = "YOUR_TWITTER_CLIENT_ID"; // Replace with your Twitter Client ID
        return `https://twitter.com/i/oauth2/authorize?` +
          `response_type=code&` +
          `client_id=${twitterClientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=tweet.read%20tweet.write%20users.read&` +
          `state=${user?.id}_${platform}&` +
          `code_challenge=challenge&` +
          `code_challenge_method=plain`;
      
      case 'linkedin':
        const linkedinClientId = "YOUR_LINKEDIN_CLIENT_ID"; // Replace with your LinkedIn Client ID
        return `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code&` +
          `client_id=${linkedinClientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=r_liteprofile%20w_member_social&` +
          `state=${user?.id}_${platform}`;
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  };

  const handlePlatformCallback = async (code: string, platform: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('social-auth', {
        body: {
          action: 'connect',
          platform,
          code,
          userId: user.id,
        },
      });

      if (error) throw error;

      await fetchConnections();
      return data;
    } catch (err) {
      console.error(`Error connecting ${platform}:`, err);
      throw err;
    }
  };

  const disconnectConnection = async (connectionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.functions.invoke('social-auth', {
        body: {
          action: 'disconnect',
          connectionId,
          userId: user.id,
        },
      });

      if (error) throw error;

      await fetchConnections();
    } catch (err) {
      console.error('Error disconnecting:', err);
      throw err;
    }
  };

  const refreshConnection = async (connectionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.functions.invoke('social-auth', {
        body: {
          action: 'refresh',
          connectionId,
          userId: user.id,
        },
      });

      if (error) throw error;

      await fetchConnections();
    } catch (err) {
      console.error('Error refreshing connection:', err);
      throw err;
    }
  };

  const getConnectionByPlatform = (platform: string) => {
    return connections.find(conn => conn.platform === platform);
  };

  const getConnectedPlatforms = () => {
    return connections.map(conn => conn.platform);
  };

  return {
    connections,
    isLoading,
    error,
    connectPlatform,
    handlePlatformCallback,
    disconnectConnection,
    refreshConnection,
    getConnectionByPlatform,
    getConnectedPlatforms,
    refreshConnections: fetchConnections,
  };
};