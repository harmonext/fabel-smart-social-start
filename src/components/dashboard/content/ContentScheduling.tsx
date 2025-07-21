
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useState } from "react";
import { useScheduledContent, ScheduledContent } from "@/hooks/useScheduledContent";

const CalendarView = ({ posts, currentDate, setCurrentDate }: {
  posts: ScheduledContent[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}) => {
  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "h-3 w-3" };
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook {...iconProps} className="h-3 w-3 text-blue-600" />;
      case 'instagram': return <Instagram {...iconProps} className="h-3 w-3 text-pink-600" />;
      case 'linkedin': return <Linkedin {...iconProps} className="h-3 w-3 text-blue-700" />;
      case 'twitter': return <Twitter {...iconProps} className="h-3 w-3 text-blue-400" />;
      case 'pinterest': return <div className="h-3 w-3 bg-red-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">P</span>
      </div>;
      default: return <div className="h-3 w-3 bg-gray-400 rounded"></div>;
    }
  };

  const getPersonaColor = (persona: string) => {
    // Generate color based on persona name for dynamic personas
    if (!persona) return 'bg-gray-100 text-gray-800 border border-gray-200';
    
    // Hash the persona name to get consistent colors
    let hash = 0;
    for (let i = 0; i < persona.length; i++) {
      hash = persona.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-100 text-blue-800 border border-blue-200',
      'bg-green-100 text-green-800 border border-green-200',
      'bg-purple-100 text-purple-800 border border-purple-200',
      'bg-pink-100 text-pink-800 border border-pink-200',
      'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'bg-red-100 text-red-800 border border-red-200',
      'bg-orange-100 text-orange-800 border border-orange-200'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const getPersonaAvatar = (persona: string) => {
    if (!persona) return '👤';
    
    // Generate avatar based on first letter of persona name
    const firstLetter = persona.charAt(0).toUpperCase();
    return firstLetter;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPostsForDate = (day: number) => {
    return posts.filter(post => {
      if (!post.scheduled_at) return false;
      const postDate = new Date(post.scheduled_at);
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
                  {postsForDay.slice(0, 3).map((post, index) => (
                    <TooltipProvider key={post.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`text-xs p-1.5 rounded-md flex items-center gap-1.5 ${getPersonaColor(post.persona_name || '')} hover:shadow-sm transition-shadow cursor-pointer`}
                          >
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {getSocialIcon(post.platform)}
                              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-xs font-medium">
                                {getPersonaAvatar(post.persona_name || '')}
                              </div>
                            </div>
                            <div className="truncate text-xs font-medium min-w-0">
                              {post.title.length > 20 ? `${post.title.substring(0, 20)}...` : post.title}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs">
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <div>Platform: {post.platform}</div>
                              <div>Persona: {post.persona_name || 'Unknown'}</div>
                              {post.scheduled_at && (
                                <div>Scheduled: {new Date(post.scheduled_at).toLocaleTimeString()}</div>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {postsForDay.length > 3 && (
                    <div className="text-xs text-muted-foreground font-medium px-1.5">
                      +{postsForDay.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Platform Icons</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Facebook className="h-3 w-3 text-blue-600" />
                  <span className="text-sm text-muted-foreground">Facebook</span>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-3 w-3 text-pink-600" />
                  <span className="text-sm text-muted-foreground">Instagram</span>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-3 w-3 text-blue-700" />
                  <span className="text-sm text-muted-foreground">LinkedIn</span>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-3 w-3 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Twitter</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Pinterest</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Persona Icons</h4>
              <div className="space-y-2">
                {Array.from(new Set(posts.map(post => post.persona_name).filter(Boolean))).map((persona) => (
                  <div key={persona as string} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${getPersonaColor(persona as string)}`}>
                      {getPersonaAvatar(persona as string)}
                    </div>
                    <span className="text-sm text-muted-foreground">{persona as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContentScheduling = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { content, isLoading, getContentByStatus, deleteContent } = useScheduledContent();

  const formatScheduledTime = (scheduledAt?: string) => {
    if (!scheduledAt) return 'Not scheduled';
    const date = new Date(scheduledAt);
    return date.toLocaleString();
  };

  const formatEngagement = (engagementData?: any) => {
    if (!engagementData || typeof engagementData !== 'object') return 'No engagement data';
    const { likes = 0, comments = 0, shares = 0 } = engagementData as Record<string, number>;
    return `${likes} likes, ${comments} comments, ${shares} shares`;
  };

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
          {isLoading ? (
            <div className="text-center py-8">Loading scheduled posts...</div>
          ) : getContentByStatus('scheduled').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No scheduled posts yet</div>
          ) : (
            getContentByStatus('scheduled').map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{post.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatScheduledTime(post.scheduled_at)}
                        </span>
                        <span>📘 {post.platform}</span>
                        <span>👤 {post.persona_name || 'No persona'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteContent(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading drafts...</div>
          ) : getContentByStatus('draft').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No drafts yet</div>
          ) : (
            getContentByStatus('draft').map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{post.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>📘 {post.platform}</span>
                        <span>👤 {post.persona_name || 'No persona'}</span>
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
            ))
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading published posts...</div>
          ) : getContentByStatus('published').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No published posts yet</div>
          ) : (
            getContentByStatus('published').map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{post.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>📘 {post.platform}</span>
                        <span>Published {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unknown'}</span>
                        <span>{formatEngagement(post.engagement_data)}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        </Tabs>
      ) : (
        <CalendarView 
          posts={content.filter(post => post.status === "scheduled")} 
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
              <div className="text-2xl font-bold text-blue-600">{getContentByStatus('scheduled').length}</div>
              <div className="text-sm text-blue-700">Scheduled Posts</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getContentByStatus('published').length}</div>
              <div className="text-sm text-green-700">Published Posts</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{new Set(content.map(post => post.platform)).size}</div>
              <div className="text-sm text-purple-700">Active Platforms</div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{getContentByStatus('draft').length}</div>
              <div className="text-sm text-orange-700">Draft Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentScheduling;
