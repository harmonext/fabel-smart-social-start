import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSignedUrls = () => {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getSignedUrl = async (path: string): Promise<string> => {
    // Check if we already have a valid signed URL
    if (signedUrls[path]) {
      return signedUrls[path];
    }

    // Set loading state
    setLoading(prev => ({ ...prev, [path]: true }));

    try {
      const { data, error } = await supabase.storage
        .from('scheduled-content-media')
        .createSignedUrl(path, 3600); // 1 hour expiry

      if (error) throw error;

      if (data?.signedUrl) {
        setSignedUrls(prev => ({ ...prev, [path]: data.signedUrl }));
        return data.signedUrl;
      }

      throw new Error('Failed to generate signed URL');
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, [path]: false }));
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      const { error: uploadError } = await supabase.storage
        .from('scheduled-content-media')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Generate signed URL for the uploaded file
      return await getSignedUrl(path);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return {
    getSignedUrl,
    uploadFile,
    loading: (path: string) => loading[path] || false
  };
};