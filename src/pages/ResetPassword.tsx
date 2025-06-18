
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { LoadingCard } from "@/components/auth/LoadingCard";

const ResetPassword = () => {
  const { isValidToken, isLoading, updatePassword } = usePasswordReset();

  if (!isValidToken) {
    return <LoadingCard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Set new password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResetPasswordForm onSubmit={updatePassword} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
