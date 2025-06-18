
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const LoadingCard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gold/20 via-background to-muted-teal/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Validating reset link...</CardTitle>
          <CardDescription>
            Please wait while we verify your reset link
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
