
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EmailVerification = () => {
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

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        toast({
          title: "Failed to resend verification",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Verification email sent",
          description: "A new verification email has been sent to your email address."
        });
        setResendTimer(60);
      }
    } catch (error) {
      toast({
        title: "Failed to resend verification",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
          <CardDescription>
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the verification link in your email to complete your account setup.
            </p>
            
            <p className="text-sm text-muted-foreground">
              After clicking the link, you'll be automatically signed in and redirected to your dashboard.
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email?
            </p>
            <Button
              variant="ghost"
              className="p-0 h-auto font-normal"
              onClick={handleResendVerification}
              disabled={isResending || resendTimer > 0}
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend email in ${resendTimer}s`
                : "Resend verification email"
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
