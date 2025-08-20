import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSecureTokens = () => {
  const { user } = useAuth();

  const getDecryptedToken = async (platform: string, tokenType: 'access' | 'refresh' = 'access'): Promise<string | null> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase.functions.invoke('secure-token-manager', {
        body: {
          action: 'decrypt_for_use',
          platform,
          token_type: tokenType
        }
      });

      if (error) {
        console.error('Error retrieving decrypted token:', error);
        return null;
      }

      return data?.token || null;
    } catch (err) {
      console.error('Error in getDecryptedToken:', err);
      return null;
    }
  };

  return {
    getDecryptedToken
  };
};