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

  const connectFacebook = async (): Promise<string> => {
    const facebookAppId = "1062833901736033"; // Replace with your actual Facebook App ID
    const redirectUri = `${window.location.origin}/dashboard?tab=social&subtab=connections`;
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${facebookAppId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=pages_manage_posts,pages_read_engagement,pages_show_list&` +
      `response_type=code&` +
      `state=${user?.id}`;

    return authUrl;
  };

  const handleFacebookCallback = async (code: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('facebook-auth', {
        body: {
          action: 'connect',
          code,
          userId: user.id,
        },
      });

      if (error) throw error;

      await fetchConnections();
      return data;
    } catch (err) {
      console.error('Error connecting Facebook:', err);
      throw err;
    }
  };

  const disconnectConnection = async (connectionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.functions.invoke('facebook-auth', {
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
      const { error } = await supabase.functions.invoke('facebook-auth', {
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
    connectFacebook,
    handleFacebookCallback,
    disconnectConnection,
    refreshConnection,
    getConnectionByPlatform,
    getConnectedPlatforms,
    refreshConnections: fetchConnections,
  };
};