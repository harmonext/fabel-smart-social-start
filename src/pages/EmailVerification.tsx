
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get email from session storage
    const verificationEmail = sessionStorage.getItem('verificationEmail');
    if (!verificationEmail) {
      navigate('/signup');
      return;
    }
    setEmail(verificationEmail);
  }, [navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleVerifyOtp = async () => {
    if (!email || otp.length !== 6) return;
    
    setIsVerifying(true);
    
    try {
      console.log('Verifying OTP for email:', email, 'OTP:', otp);
      
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup'
      });

      console.log('OTP verification response:', { data, error });

      if (error) {
        console.error('OTP verification error:', error);
        toast({
          title: "Verification failed",
          description: error.message || "Invalid verification code. Please try again.",
          variant: "destructive"
        });
        // Clear the OTP field on error
        setOtp("");
      } else if (data.user) {
        console.log('OTP verification successful, user:', data.user.email);
        toast({
          title: "Email verified!",
          description: "Your account has been successfully verified. You're now signed in."
        });
        // Clear the stored email
        sessionStorage.removeItem('verificationEmail');
        navigate('/address-collection');
      }
    } catch (error: any) {
      console.error('Unexpected OTP verification error:', error);
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    setIsResending(true);
    
    try {
      console.log('Resending OTP to email:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error('Resend OTP error:', error);
        toast({
          title: "Failed to resend code",
          description: error.message || "Unable to resend verification code. Please try again.",
          variant: "destructive"
        });
      } else {
        console.log('OTP resent successfully');
        toast({
          title: "Verification code sent",
          description: "A new 6-digit code has been sent to your email address."
        });
        setResendTimer(60);
        setOtp(""); // Clear current OTP
      }
    } catch (error: any) {
      console.error('Unexpected resend error:', error);
      toast({
        title: "Failed to resend code",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Verify your email</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email to verify your account.
            </p>
            
            {isVerifying && (
              <p className="text-sm text-muted-foreground">
                Verifying your code...
              </p>
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              className="p-0 h-auto font-normal"
              onClick={handleResendCode}
              disabled={isResending || resendTimer > 0}
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend verification code"
              }
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground"
            >
              <Link to="/signup">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to signup
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
