import { supabase } from "@/integrations/supabase/client";

// Generate a 6-digit OTP
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in session storage with expiry
export const storeOtp = (email: string, otp: string): void => {
  const otpData = {
    otp,
    email,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    createdAt: Date.now(),
  };
  sessionStorage.setItem('pendingOtp', JSON.stringify(otpData));
};

// Get stored OTP data
export const getStoredOtp = (): { otp: string; email: string; expiresAt: number; createdAt: number } | null => {
  const data = sessionStorage.getItem('pendingOtp');
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Verify OTP
export const verifyStoredOtp = (inputOtp: string): { valid: boolean; expired: boolean } => {
  const stored = getStoredOtp();
  
  if (!stored) {
    return { valid: false, expired: false };
  }
  
  if (Date.now() > stored.expiresAt) {
    return { valid: false, expired: true };
  }
  
  return { valid: stored.otp === inputOtp, expired: false };
};

// Clear stored OTP
export const clearStoredOtp = (): void => {
  sessionStorage.removeItem('pendingOtp');
};

// Send OTP via edge function
export const sendOtpEmail = async (
  email: string, 
  otp: string, 
  firstName?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp-email', {
      body: { email, otp, firstName },
    });

    if (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error: error.message };
    }

    console.log('OTP email sent successfully:', data);
    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error sending OTP:', err);
    return { success: false, error: err.message };
  }
};
