
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Plus, CheckCircle, XCircle, Settings, Loader2 } from "lucide-react";
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SocialConnections = () => {
  const { 
    connections, 
    isLoading, 
    error, 
    connectPlatform, 
    handlePlatformCallback, 
    disconnectConnection, 
    refreshConnection,
    getConnectionByPlatform 
  } = useSocialConnections();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  // Handle OAuth callback for all platforms
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      // Extract platform from state (format: userId_platform_nonce)
      const platform = state.split('_')[1];
      if (platform) {
        handlePlatformCallback(code, platform, state)
          .then(() => {
            toast({
              title: "Success",
              description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} account connected successfully!`,
            });
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch((err) => {
            toast({
              title: "Error",
              description: err.message || `Failed to connect ${platform} account`,
              variant: "destructive",
            });
          });
      }
    }
  }, [handlePlatformCallback, toast]);

  const socialPlatforms = [
    {
      platform: "facebook",
      name: "Facebook",
      icon: "fab fa-facebook text-blue-600"
    },
    {
      platform: "instagram", 
      name: "Instagram",
      icon: "fab fa-instagram text-pink-500"
    },
    {
      platform: "twitter",
      name: "Twitter/X",
      icon: "fab fa-twitter text-sky-500"
    },
    {
      platform: "linkedin",
      name: "LinkedIn",
      icon: "fab fa-linkedin text-blue-700"
    },
    {
      platform: "pinterest",
      name: "Pinterest",
      icon: "fab fa-pinterest text-red-600"
    },
    {
      platform: "tiktok",
      name: "TikTok",
      icon: "fab fa-tiktok text-gray-900"
    }
  ];

  const handleConnect = async (platform: string) => {
    // Support for implemented platforms
    const supportedPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
    
    if (supportedPlatforms.includes(platform)) {
      try {
        setIsConnecting(platform);
        const authUrl = await connectPlatform(platform);
        window.location.href = authUrl;
      } catch (err) {
        toast({
          title: "Error",
          description: `Failed to initiate ${platform} connection`,
          variant: "destructive",
        });
        setIsConnecting(null);
      }
    } else {
      toast({
        title: "Coming Soon",
        description: `${platform} integration will be available soon!`,
      });
    }
  };

  const handleDisconnect = async (connectionId: string, platformName: string) => {
    try {
      await disconnectConnection(connectionId);
      toast({
        title: "Success",
        description: `${platformName} account disconnected successfully!`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to disconnect account",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async (connectionId: string, platformName: string) => {
    try {
      await refreshConnection(connectionId);
      toast({
        title: "Success",
        description: `${platformName} connection refreshed successfully!`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to refresh connection",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <p className="text-destructive">Error loading connections: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Social Connections</h1>
        <p className="text-muted-foreground">Connect your social media accounts to start scheduling and managing content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialPlatforms.map((platform) => {
          const connection = getConnectionByPlatform(platform.platform);
          const isConnected = !!connection;
          
          return (
            <Card key={platform.name}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    <i className={`${platform.icon} text-xl`}></i>
                    <span>{platform.name}</span>
                  </div>
                  {isConnected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected && connection ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Account:</strong> {connection.account_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Followers:</strong> {connection.followers_count.toLocaleString()}
                    </p>
                    <div className="pt-2 space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage {platform.name} Connection</DialogTitle>
                            <DialogDescription>
                              Update your {platform.name} connection settings.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium">Account: {connection.account_name}</p>
                              <p className="text-sm text-muted-foreground">Platform ID: {connection.platform_user_id}</p>
                              <p className="text-sm text-muted-foreground">
                                Connected: {new Date(connection.connected_at).toLocaleDateString()}
                              </p>
                              {connection.last_sync_at && (
                                <p className="text-sm text-muted-foreground">
                                  Last sync: {new Date(connection.last_sync_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="space-x-2">
                              <Button 
                                onClick={() => handleRefresh(connection.id, platform.name)}
                                variant="outline"
                              >
                                Refresh Token
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDisconnect(connection.id, platform.name)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Connect your {platform.name} account to start posting content automatically.
                    </p>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleConnect(platform.platform)}
                        disabled={isConnecting === platform.platform}
                      >
                        {isConnecting === platform.platform ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Connect {platform.name}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage {platform.name} Connection</DialogTitle>
                            <DialogDescription>
                              Set up your {platform.name} connection settings.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                This {platform.name} account is not yet connected. Use the Connect button to authorize your account.
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
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
              <div className="text-2xl font-bold text-green-600">{connections.length}</div>
              <div className="text-sm text-green-700">Connected Accounts</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {connections.reduce((total, conn) => total + conn.followers_count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Total Followers</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">-</div>
              <div className="text-sm text-purple-700">Posts This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialConnections;
