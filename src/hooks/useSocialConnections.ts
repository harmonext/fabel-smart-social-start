import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SocialConnection {
  id: string;
  platform: string;
  platform_user_id: string;
  account_name: string;
  followers_count: number;
  is_active: boolean;
  connected_at: string;
  last_sync_at: string | null;
  token_expires_at: string | null;
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
      
      // Use secure edge function that doesn't expose tokens
      const { data, error } = await supabase.functions.invoke('secure-social-connections', {
        body: { action: 'list' },
      });

      if (error) throw error;

      const realConnections = data?.connections || [];
      
      // Mock Facebook connection for testing
      const mockFacebookConnection: SocialConnection = {
        id: 'mock-facebook-id',
        platform: 'facebook',
        platform_user_id: 'mock-facebook-user-123',
        account_name: 'Test Facebook Page',
        followers_count: 15420,
        is_active: true,
        connected_at: new Date().toISOString(),
        last_sync_at: new Date().toISOString(),
        token_expires_at: null
      };

      // Add mock connection if Facebook isn't already connected
      const hasFacebook = realConnections.some((conn: any) => conn.platform === 'facebook');
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
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('secure-social-auth', {
        body: {
          action: 'connect',
          platform,
        },
      });

      if (error) throw error;

      return data.authUrl;
    } catch (err) {
      console.error(`Error generating auth URL for ${platform}:`, err);
      throw err;
    }
  };

  const handlePlatformCallback = async (code: string, platform: string, state: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('secure-social-auth', {
        body: {
          action: 'callback',
          platform,
          code,
          state,
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
      const { error } = await supabase.functions.invoke('secure-social-connections', {
        body: {
          action: 'disconnect',
          connectionId,
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
      const { error } = await supabase.functions.invoke('secure-social-connections', {
        body: {
          action: 'refresh',
          connectionId,
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