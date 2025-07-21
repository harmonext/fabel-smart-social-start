
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useState } from "react";
import { useScheduledContent, ScheduledContent } from "@/hooks/useScheduledContent";

const CalendarView = ({ posts, allContent, currentDate, setCurrentDate }: {
  posts: ScheduledContent[];
  allContent: ScheduledContent[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}) => {
  const getSocialIcon = (platform: string, size: 'sm' | 'md' = 'sm') => {
    const sizeClasses = size === 'sm' ? "h-3 w-3" : "h-4 w-4";
    const iconProps = { className: sizeClasses };
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook {...iconProps} className={`${sizeClasses} text-blue-600`} />;
      case 'instagram': return <Instagram {...iconProps} className={`${sizeClasses} text-pink-600`} />;
      case 'linkedin': return <Linkedin {...iconProps} className={`${sizeClasses} text-blue-700`} />;
      case 'twitter': return <Twitter {...iconProps} className={`${sizeClasses} text-blue-400`} />;
      case 'pinterest': return <div className={`${sizeClasses} bg-red-600 rounded-full flex items-center justify-center`}>
        <span className="text-white text-xs font-bold">P</span>
      </div>;
      default: return <div className={`${sizeClasses} bg-gray-400 rounded`}></div>;
    }
  };

  const getPersonaColor = (persona: string, variant: 'light' | 'dark' = 'light') => {
    // Generate color based on persona name for dynamic personas
    if (!persona) return variant === 'light' 
      ? 'bg-gray-100 text-gray-800 border border-gray-300' 
      : 'bg-gray-800 text-gray-100 border border-gray-600';
    
    // Hash the persona name to get consistent colors
    let hash = 0;
    for (let i = 0; i < persona.length; i++) {
      hash = persona.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const lightColors = [
      'bg-blue-100 text-blue-900 border border-blue-300',
      'bg-green-100 text-green-900 border border-green-300',
      'bg-purple-100 text-purple-900 border border-purple-300',
      'bg-pink-100 text-pink-900 border border-pink-300',
      'bg-yellow-100 text-yellow-900 border border-yellow-300',
      'bg-indigo-100 text-indigo-900 border border-indigo-300',
      'bg-red-100 text-red-900 border border-red-300',
      'bg-orange-100 text-orange-900 border border-orange-300'
    ];

    const darkColors = [
      'bg-blue-800 text-blue-100 border border-blue-600',
      'bg-green-800 text-green-100 border border-green-600',
      'bg-purple-800 text-purple-100 border border-purple-600',
      'bg-pink-800 text-pink-100 border border-pink-600',
      'bg-yellow-800 text-yellow-100 border border-yellow-600',
      'bg-indigo-800 text-indigo-100 border border-indigo-600',
      'bg-red-800 text-red-100 border border-red-600',
      'bg-orange-800 text-orange-100 border border-orange-600'
    ];
    
    const colors = variant === 'light' ? lightColors : darkColors;
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
                <div className="space-y-1 overflow-hidden">
                  {postsForDay.slice(0, 3).map((post, index) => {
                    const scheduledTime = post.scheduled_at ? new Date(post.scheduled_at) : null;
                    const timeString = scheduledTime ? scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                    const shortTitle = post.title.length > 12 ? `${post.title.substring(0, 12)}...` : post.title;
                    
                    return (
                      <TooltipProvider key={post.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`text-xs p-2 rounded-lg flex flex-col gap-1.5 min-h-[32px] ${getPersonaColor(post.persona_name || '')} hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer border-2`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <div className="p-0.5 bg-white/95 rounded-full shadow-sm">
                                    {getSocialIcon(post.platform)}
                                  </div>
                                  <div className="w-5 h-5 rounded-full bg-white/95 flex items-center justify-center text-xs font-bold shadow-sm border">
                                    {getPersonaAvatar(post.persona_name || '')}
                                  </div>
                                </div>
                                {timeString && (
                                  <div className="text-xs font-mono bg-black/10 px-1.5 py-0.5 rounded">
                                    {timeString}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs font-semibold leading-tight">
                                {shortTitle}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start" className="max-w-sm p-4">
                            <div className="space-y-3">
                              <div>
                                <div className="font-bold text-base text-foreground mb-1">{post.title}</div>
                                <div className="text-sm text-muted-foreground">{post.content ? `${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}` : 'No content preview'}</div>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-3 text-sm">
                                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">Platform:</span>
                                    <div className="flex items-center gap-1.5">
                                      {getSocialIcon(post.platform, 'md')}
                                      <span className="capitalize font-medium">{post.platform}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                  <span className="font-medium text-foreground">Persona:</span>
                                  <div className={`px-2 py-1 rounded-full text-sm font-medium border-2 ${getPersonaColor(post.persona_name || '', 'dark')}`}>
                                    <span className="mr-1">{getPersonaAvatar(post.persona_name || '')}</span>
                                    {post.persona_name || 'No persona'}
                                  </div>
                                </div>
                              </div>
                              
                              {post.scheduled_at && (
                                <div className="border-t pt-3">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="font-medium text-foreground">Scheduled for:</span>
                                  </div>
                                  <div className="mt-1 text-sm font-mono bg-muted p-2 rounded">
                                    {new Date(post.scheduled_at).toLocaleDateString([], {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })} at {new Date(post.scheduled_at).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {post.goal && (
                                <div className="border-t pt-3">
                                  <div className="flex items-center gap-2 text-sm mb-1">
                                    <span className="font-medium text-foreground">Campaign Goal:</span>
                                  </div>
                                  <div className="text-sm bg-primary/10 text-primary p-2 rounded border border-primary/20">
                                    {post.goal}
                                  </div>
                                </div>
                              )}
                              
                              <div className="text-xs text-muted-foreground border-t pt-2">
                                Status: <span className="capitalize font-medium">{post.status}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                  {postsForDay.length > 3 && (
                    <div className="text-xs text-muted-foreground font-medium px-2 py-1.5 bg-muted/50 rounded-lg text-center border-2 border-dashed border-muted-foreground/30">
                      +{postsForDay.length - 3} more posts
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Enhanced Legend */}
        <div className="mt-6 pt-4 border-t bg-muted/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Platform Icons
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-3 p-2 bg-background rounded-lg border shadow-sm">
                  <div className="p-1 bg-blue-50 rounded-full">
                    <Facebook className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-background rounded-lg border shadow-sm">
                  <div className="p-1 bg-pink-50 rounded-full">
                    <Instagram className="h-4 w-4 text-pink-600" />
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-background rounded-lg border shadow-sm">
                  <div className="p-1 bg-blue-50 rounded-full">
                    <Linkedin className="h-4 w-4 text-blue-700" />
                  </div>
                  <span className="text-sm font-medium">LinkedIn</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-background rounded-lg border shadow-sm">
                  <div className="p-1 bg-blue-50 rounded-full">
                    <Twitter className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-background rounded-lg border shadow-sm col-span-2">
                  <div className="p-1 bg-red-50 rounded-full">
                    <div className="h-4 w-4 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">Pinterest</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                Active Personas
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Array.from(new Set(allContent.map(post => post.persona_name).filter(Boolean))).map((persona) => (
                  <div key={persona as string} className="flex items-center justify-between gap-3 p-3 bg-background rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${getPersonaColor(persona as string, 'dark')}`}>
                        {getPersonaAvatar(persona as string)}
                      </div>
                      <span className="text-sm font-medium">{persona as string}</span>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {allContent.filter(p => p.persona_name === persona).length} posts
                    </div>
                  </div>
                ))}
                {allContent.filter(post => post.persona_name).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No personas assigned to content yet
                  </div>
                )}
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
          posts={content.filter(post => post.scheduled_at)} 
          allContent={content}
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
