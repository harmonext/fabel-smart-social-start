
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePasswordReset = () => {
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      // For password reset, Supabase automatically handles the session
      // We just need to check if we have a valid session
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          toast({
            title: "Invalid reset link",
            description: "This reset link is invalid or has expired.",
            variant: "destructive"
          });
          navigate('/forgot-password');
          return;
        }

        if (session && session.user) {
          console.log('Valid reset session found for user:', session.user.email);
          setIsValidToken(true);
        } else {
          console.log('No valid session found');
          toast({
            title: "Invalid reset link",
            description: "This reset link is invalid or has expired. Please request a new one.",
            variant: "destructive"
          });
          navigate('/forgot-password');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast({
          title: "Error",
          description: "An error occurred while processing the reset link.",
          variant: "destructive"
        });
        navigate('/forgot-password');
      }
    };

    handlePasswordReset();
  }, [navigate, toast]);

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated."
        });
        navigate('/dashboard');
        return true;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isValidToken,
    isLoading,
    updatePassword
  };
};
