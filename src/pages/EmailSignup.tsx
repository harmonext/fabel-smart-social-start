
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const EmailSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    general: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    // Enhanced email regex that requires a proper domain with at least one dot and TLD
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({
      email: "",
      password: "",
      confirmPassword: "",
      general: ""
    });

    let hasErrors = false;
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      general: ""
    };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address with a proper domain (e.g., user@example.com).";
      hasErrors = true;
    }
    
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please try again.";
      hasErrors = true;
    }

    if (hasErrors) {
      setValidationErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Signing up user with email:', formData.email);

      // Sign up with OTP verification
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
          setValidationErrors(prev => ({
            ...prev,
            general: "An account with this email already exists. Please sign in instead."
          }));
        } else if (error.message.toLowerCase().includes('weak') || error.message.toLowerCase().includes('password should contain')) {
          setValidationErrors(prev => ({
            ...prev,
            general: "Password must include: • 1 lowercase letter • 1 uppercase letter • 1 number • 1 special character (!@#$%^&*_<>{}[] etc.) Your password is too weak. Please choose a stronger one."
          }));
        } else {
          setValidationErrors(prev => ({
            ...prev,
            general: error.message
          }));
        }
      } else if (data.user && !data.session) {
        // User created successfully, OTP should be sent
        sessionStorage.setItem('verificationEmail', formData.email);
        
        toast({
          title: "Check your email!",
          description: "We've sent you a 6-digit verification code. Please check your email and enter the code to verify your account."
        });
        
        navigate('/signup/verify-email');
      } else if (data.session) {
        // User was created and automatically signed in (email confirmation disabled)
        toast({
          title: "Account created!",
          description: "Your account has been successfully created and you're now signed in."
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setValidationErrors(prev => ({
        ...prev,
        general: "An unexpected error occurred. Please try again."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for the field being edited
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: "",
        general: "" // Clear general error when user starts typing
      }));
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4 pt-24">
        <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <Link to="/signup">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
          </div>
          <CardDescription>
            Enter your details to create your Fabel account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={validationErrors.email ? "border-destructive" : ""}
              />
              {validationErrors.email && (
                <div className="flex items-start gap-2 p-3 border border-orange-200 bg-orange-50 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-700">{validationErrors.email}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={validationErrors.password ? "border-destructive" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {validationErrors.password && (
                <div className="flex items-start gap-2 p-3 border border-orange-200 bg-orange-50 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-700">{validationErrors.password}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={validationErrors.confirmPassword ? "border-destructive" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {validationErrors.confirmPassword && (
                <div className="flex items-start gap-2 p-3 border border-orange-200 bg-orange-50 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-700">{validationErrors.confirmPassword}</p>
                </div>
              )}
            </div>

            {validationErrors.general && (
              <div className="flex items-start gap-2 p-3 border border-orange-200 bg-orange-50 rounded-md">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-700">{validationErrors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    <Footer />
    </>
  );
};

export default EmailSignup;
