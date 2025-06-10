
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Apple, Mail } from "lucide-react";
import GoogleIcon from "@/components/auth/GoogleIcon";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialSignup = (provider: 'google' | 'apple') => {
    setIsLoading(true);
    // TODO: Implement social authentication
    console.log(`Signing up with ${provider}`);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
          <CardDescription>
            Choose your preferred way to sign up for Fabel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => handleSocialSignup('google')}
              disabled={isLoading}
            >
              <GoogleIcon className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => handleSocialSignup('apple')}
              disabled={isLoading}
            >
              <Apple className="mr-2 h-5 w-5" />
              Continue with Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            asChild
            variant="default"
            className="w-full h-12"
          >
            <Link to="/signup/email">
              <Mail className="mr-2 h-5 w-5" />
              Sign up with Email
            </Link>
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground px-4">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
