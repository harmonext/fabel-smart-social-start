
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Plus, CheckCircle, XCircle } from "lucide-react";

const SocialConnections = () => {
  const socialPlatforms = [
    {
      name: "Facebook",
      connected: true,
      account: "@acmemarketing",
      followers: "2.1K",
      icon: "fab fa-facebook text-blue-600"
    },
    {
      name: "Instagram",
      connected: true,
      account: "@acme_marketing",
      followers: "1.8K",
      icon: "fab fa-instagram text-pink-500"
    },
    {
      name: "Twitter/X",
      connected: false,
      account: "",
      followers: "",
      icon: "fab fa-twitter text-sky-500"
    },
    {
      name: "LinkedIn",
      connected: true,
      account: "Acme Marketing Solutions",
      followers: "856",
      icon: "fab fa-linkedin text-blue-700"
    },
    {
      name: "Pinterest",
      connected: false,
      account: "",
      followers: "",
      icon: "fab fa-pinterest text-red-600"
    },
    {
      name: "TikTok",
      connected: false,
      account: "",
      followers: "",
      icon: "fab fa-tiktok text-gray-900"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Social Connections</h1>
        <p className="text-muted-foreground">Connect your social media accounts to start scheduling and managing content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialPlatforms.map((platform) => (
          <Card key={platform.name}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-3">
                  <i className={`${platform.icon} text-xl`}></i>
                  <span>{platform.name}</span>
                </div>
                {platform.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {platform.connected ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Account:</strong> {platform.account}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Followers:</strong> {platform.followers}
                  </p>
                  <div className="pt-2 space-x-2">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Connect your {platform.name} account to start posting content automatically.
                  </p>
                  <Button size="sm" className="bg-fabel-primary hover:bg-fabel-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect {platform.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Overview of your social media connections and posting capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-700">Connected Accounts</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4.8K</div>
              <div className="text-sm text-blue-700">Total Followers</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-purple-700">Posts This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialConnections;
