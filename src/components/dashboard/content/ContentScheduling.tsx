
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const CalendarView = ({ posts, currentDate, setCurrentDate }: {
  posts: any[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook': return '📘';
      case 'Instagram': return '📷';
      case 'LinkedIn': return '💼';
      case 'Twitter': return '🐦';
      default: return '📱';
    }
  };

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'Ambitious Entrepreneur': return 'bg-blue-100 text-blue-800';
      case 'Community Builder': return 'bg-green-100 text-green-800';
      case 'Digital Native': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPostsForDate = (day: number) => {
    return posts.filter(post => {
      const postDate = new Date(post.date);
      return postDate.getDate() === day && 
             postDate.getMonth() === currentDate.getMonth() && 
             postDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          View all scheduled content for the month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-24"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const postsForDay = getPostsForDate(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();
            
            return (
              <div
                key={day}
                className={`h-24 border rounded-lg p-1 ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-600' : 'text-foreground'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {postsForDay.map((post, index) => (
                    <div
                      key={post.id}
                      className={`text-xs p-1 rounded flex items-center gap-1 ${getPersonaColor(post.persona)}`}
                      title={`${post.title} - ${post.platform}`}
                    >
                      <span>{getSocialIcon(post.platform)}</span>
                      <span className="truncate">{post.persona}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Persona Legend</h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100"></div>
              <span className="text-sm text-muted-foreground">Ambitious Entrepreneur</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100"></div>
              <span className="text-sm text-muted-foreground">Community Builder</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-100"></div>
              <span className="text-sm text-muted-foreground">Digital Native</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContentScheduling = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const scheduledPosts = [
    {
      id: 1,
      title: "5 Tips for Small Business Marketing",
      platform: "Facebook",
      scheduledTime: "Today, 2:00 PM",
      status: "scheduled",
      persona: "Ambitious Entrepreneur",
      date: new Date(2025, 0, 17) // January 17, 2025
    },
    {
      id: 2,
      title: "Community Spotlight: Local Success Story",
      platform: "Instagram",
      scheduledTime: "Tomorrow, 10:00 AM",
      status: "scheduled",
      persona: "Community Builder",
      date: new Date(2025, 0, 18) // January 18, 2025
    },
    {
      id: 3,
      title: "Latest Digital Marketing Trends",
      platform: "LinkedIn",
      scheduledTime: "March 15, 3:00 PM",
      status: "scheduled",
      persona: "Digital Native",
      date: new Date(2025, 0, 20) // January 20, 2025
    },
    {
      id: 4,
      title: "Customer Success Story",
      platform: "Facebook",
      scheduledTime: "Jan 22, 1:00 PM",
      status: "scheduled",
      persona: "Community Builder",
      date: new Date(2025, 0, 22) // January 22, 2025
    },
    {
      id: 5,
      title: "Industry Insights Weekly",
      platform: "LinkedIn",
      scheduledTime: "Jan 25, 9:00 AM",
      status: "scheduled",
      persona: "Digital Native",
      date: new Date(2025, 0, 25) // January 25, 2025
    },
    {
      id: 6,
      title: "Motivational Monday",
      platform: "Instagram",
      scheduledTime: "Jan 27, 8:00 AM",
      status: "scheduled",
      persona: "Ambitious Entrepreneur",
      date: new Date(2025, 0, 27) // January 27, 2025
    },
    {
      id: 7,
      title: "Weekend Inspiration",
      platform: "Instagram",
      scheduledTime: "Jan 31, 6:00 PM",
      status: "scheduled",
      persona: "Community Builder",
      date: new Date(2025, 0, 31) // January 31, 2025
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
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
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
      ) : (
        <CalendarView 
          posts={scheduledPosts.filter(post => post.status === "scheduled")} 
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      )}

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
