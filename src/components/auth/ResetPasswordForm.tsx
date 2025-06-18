
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput } from "./PasswordInput";

interface ResetPasswordFormProps {
  onSubmit: (password: string) => Promise<boolean>;
  isLoading: boolean;
}

export const ResetPasswordForm = ({ onSubmit, isLoading }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    await onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput
        id="password"
        label="New Password"
        placeholder="Enter your new password"
        value={password}
        onChange={setPassword}
        required
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm New Password"
        placeholder="Confirm your new password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        required
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
};
