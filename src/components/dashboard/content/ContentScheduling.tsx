
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react";

const ContentScheduling = () => {
  const scheduledPosts = [
    {
      id: 1,
      title: "5 Tips for Small Business Marketing",
      platform: "Facebook",
      scheduledTime: "Today, 2:00 PM",
      status: "scheduled",
      persona: "The Ambitious Entrepreneur"
    },
    {
      id: 2,
      title: "Community Spotlight: Local Success Story",
      platform: "Instagram",
      scheduledTime: "Tomorrow, 10:00 AM",
      status: "scheduled",
      persona: "The Community Builder"
    },
    {
      id: 3,
      title: "Latest Digital Marketing Trends",
      platform: "LinkedIn",
      scheduledTime: "March 15, 3:00 PM",
      status: "draft",
      persona: "The Digital Native"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Welcome to Our New Platform!",
      platform: "Facebook",
      publishedTime: "2 hours ago",
      engagement: "24 likes, 5 comments"
    },
    {
      id: 2,
      title: "Behind the Scenes: Our Team",
      platform: "Instagram",
      publishedTime: "1 day ago",
      engagement: "67 likes, 12 comments"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Content Scheduling</h1>
        <p className="text-muted-foreground">Schedule and manage your social media content across all platforms.</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Button className="bg-fabel-primary hover:bg-fabel-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scheduled">Scheduled Posts</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledPosts.filter(post => post.status === "scheduled").map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{post.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.scheduledTime}
                      </span>
                      <span>📘 {post.platform}</span>
                      <span>👤 {post.persona}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {scheduledPosts.filter(post => post.status === "draft").map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{post.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>📘 {post.platform}</span>
                      <span>👤 {post.persona}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Draft</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm" className="bg-fabel-primary hover:bg-fabel-primary/90">
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {recentPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{post.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>📘 {post.platform}</span>
                      <span>Published {post.publishedTime}</span>
                      <span>{post.engagement}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Your content performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-blue-700">Scheduled Posts</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-green-700">Total Engagements</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-purple-700">Active Platforms</div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">92%</div>
              <div className="text-sm text-orange-700">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentScheduling;
