import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Move, Check, X } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useState } from "react";
import { useScheduledContent, ScheduledContent } from "@/hooks/useScheduledContent";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditPostDialog } from './EditPostDialog';

// Utility functions for drag and drop validation
const getValidDateRange = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const maxDate = new Date(tomorrow);
  maxDate.setDate(maxDate.getDate() + 6); // 7 days total including tomorrow
  maxDate.setHours(23, 59, 59, 999);
  
  return { minDate: tomorrow, maxDate };
};

const isDateInValidRange = (date: Date) => {
  const { minDate, maxDate } = getValidDateRange();
  return date >= minDate && date <= maxDate;
};

const formatDateForDropzone = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// Draggable Post Component
const DraggablePost = React.forwardRef<HTMLDivElement, { 
  post: ScheduledContent; 
  children: React.ReactNode;
  editMode: boolean;
}>(
  ({ post, children, editMode }, ref) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: post.id,
      data: { post },
      disabled: !editMode // Disable dragging when not in edit mode
    });

    const style = {
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    };

    // If in edit mode, make it draggable, otherwise just render the children
    if (editMode) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          className={`${isDragging ? 'cursor-grabbing' : ''} touch-none relative group`}
        >
          {/* Drag handle covering the left 75% of the post */}
          <div 
            {...listeners} 
            className="absolute inset-y-0 left-0 right-1/4 cursor-grab hover:bg-white/10 transition-colors duration-200"
            title="Drag to reschedule"
          />
          {children}
        </div>
      );
    } else {
      // When not in edit mode, just render without drag functionality
      return <div>{children}</div>;
    }
  }
);

// Droppable Day Cell Component for Calendar
const DroppableDay = ({ date, children, className }: { 
  date: Date; 
  children: React.ReactNode;
  className?: string;
}) => {
  const isValid = isDateInValidRange(date);
  const dropId = formatDateForDropzone(date);
  
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
    data: { date },
    disabled: !isValid
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver && isValid ? 'bg-green-100 border-green-300' : ''} 
        ${!isValid ? 'opacity-50' : ''} transition-colors duration-200`}
    >
      {children}
    </div>
  );
};

// Droppable Day Container for List View
const DroppableListDay = ({ date, children, className }: { 
  date: Date; 
  children: React.ReactNode;
  className?: string;
}) => {
  const isValid = isDateInValidRange(date);
  const dropId = `list-${formatDateForDropzone(date)}`;
  
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
    data: { date },
    disabled: !isValid
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver && isValid ? 'bg-green-50 border-green-200' : ''} 
        ${!isValid ? 'opacity-50' : ''} transition-colors duration-200`}
    >
      {children}
    </div>
  );
};

// Utility functions for both Calendar and List views
const getSocialIcon = (platform: string, size: 'xs' | 'sm' | 'md' = 'sm') => {
  const sizeClasses = size === 'xs' ? "h-2 w-2" : size === 'sm' ? "h-3 w-3" : "h-4 w-4";
  const iconProps = { className: sizeClasses };
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook {...iconProps} className={`${sizeClasses} text-blue-600`} />;
    case 'instagram': return <Instagram {...iconProps} className={`${sizeClasses} text-pink-600`} />;
    case 'linkedin': return <Linkedin {...iconProps} className={`${sizeClasses} text-blue-700`} />;
    case 'twitter': return <Twitter {...iconProps} className={`${sizeClasses} text-blue-400`} />;
    case 'pinterest': return <div className={`${sizeClasses} bg-red-600 rounded-full flex items-center justify-center`}>
      <span className="text-white text-xs font-bold">P</span>
    </div>;
    case 'tiktok': return <div className={`${sizeClasses} bg-black rounded-full flex items-center justify-center`}>
      <span className="text-white text-xs font-bold">T</span>
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

// Editable Post Component
const EditablePost = ({ post, editMode, shortTitle, timeString }: {
  post: ScheduledContent;
  editMode: boolean;
  shortTitle: string;
  timeString: string;
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { updateContent } = useScheduledContent();
  const { toast } = useToast();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editMode) {
      setEditDialogOpen(true);
    }
  };

  const handleSave = async (postId: string, updates: Partial<ScheduledContent>) => {
    const success = await updateContent(postId, updates);
    if (success) {
      toast({
        title: "Post Updated",
        description: "Your post has been successfully updated.",
      });
    }
  };

  // Regular TooltipContent for view mode
  const ViewTooltipContent = () => (
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
  );

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`text-xs p-1 rounded flex items-center gap-1 min-h-[20px] ${getPersonaColor(post.persona_name || '')} hover:shadow-sm transition-all duration-200 border ${editMode ? 'cursor-pointer hover:border-primary' : ''}`}
            >
              <div className="flex items-center gap-1 flex-shrink-0">
                {getSocialIcon(post.platform, 'sm')}
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/80 border">
                  {getPersonaAvatar(post.persona_name || '')}
                </div>
              </div>
              <div className="text-[10px] font-medium leading-tight truncate flex-1">
                {shortTitle}
              </div>
              {timeString && (
                <div className="text-[8px] font-mono bg-black/10 px-1 py-0.5 rounded shrink-0">
                  {timeString}
                </div>
              )}
              {editMode && (
                <Edit 
                  className="h-5 w-5 ml-1 opacity-70 hover:opacity-100 cursor-pointer z-10" 
                  onClick={handleEditClick}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </TooltipTrigger>
          {!editMode && (
            <TooltipContent 
              side="right" 
              align="start" 
              className="max-w-sm p-4"
            >
              <ViewTooltipContent />
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      
      <EditPostDialog
        post={post}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
      />
    </>
  );
};

// Editable List Post Component
const EditableListPost = ({ post, editMode, timeString }: {
  post: ScheduledContent;
  editMode: boolean;
  timeString: string;
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { updateContent } = useScheduledContent();
  const { toast } = useToast();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editMode) {
      setEditDialogOpen(true);
    }
  };

  const handleSave = async (postId: string, updates: Partial<ScheduledContent>) => {
    const success = await updateContent(postId, updates);
    if (success) {
      toast({
        title: "Post Updated",
        description: "Your post has been successfully updated.",
      });
    }
  };

  return (
    <>
      <div className={`flex items-center gap-3 p-3 rounded-lg ${getPersonaColor(post.persona_name || '')} hover:shadow-sm transition-all duration-200 border cursor-pointer hover:border-primary`}>
        <div className="flex items-center gap-2 flex-shrink-0">
          {getSocialIcon(post.platform, 'md')}
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold bg-white/80 border">
            {getPersonaAvatar(post.persona_name || '')}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {post.title}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {post.content ? `${post.content.substring(0, 60)}${post.content.length > 60 ? '...' : ''}` : 'No content'}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {timeString && (
            <div className="text-xs font-mono bg-black/10 px-2 py-1 rounded">
              {timeString}
            </div>
          )}
          <Edit 
            className="h-5 w-5 opacity-70 hover:opacity-100 cursor-pointer z-10" 
            onClick={handleEditClick}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      
      <EditPostDialog
        post={post}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
      />
    </>
  );
};

const ListView = ({ posts, allContent, currentDate, setCurrentDate, onReschedule, editMode }: {
  posts: ScheduledContent[];
  allContent: ScheduledContent[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onReschedule: (postId: string, newDate: Date) => void;
  editMode: boolean;
}) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Generate all days of the current month
  const daysInMonth = getDaysInMonth(currentDate);
  const daysToShow = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    daysToShow.push(date);
  }

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      if (!post.scheduled_at) return false;
      const postDate = new Date(post.scheduled_at);
      return postDate.getDate() === date.getDate() && 
             postDate.getMonth() === date.getMonth() && 
             postDate.getFullYear() === date.getFullYear();
    }).sort((a, b) => {
      if (!a.scheduled_at || !b.scheduled_at) return 0;
      return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
          {editMode ? 'Drag posts to reschedule them' : 'Hover over posts to see details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daysToShow.map((date) => {
            const postsForDay = getPostsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();
            
            return editMode ? (
              <DroppableListDay
                key={date.toISOString()}
                date={date}
                className={`p-4 border rounded-lg ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className={`font-medium mb-3 ${
                  isToday ? 'text-blue-600' : 'text-foreground'
                }`}>
                  {date.toLocaleDateString([], {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                {postsForDay.length > 0 ? (
                  <div className="space-y-2">
                    {postsForDay.map((post) => {
                      const scheduledTime = post.scheduled_at ? new Date(post.scheduled_at) : null;
                      const timeString = scheduledTime ? scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                      
                       return (
                         <DraggablePost key={post.id} post={post} editMode={editMode}>
                           <EditableListPost post={post} editMode={editMode} timeString={timeString} />
                         </DraggablePost>
                       );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic py-4">
                    No posts scheduled for this day
                  </div>
                )}
              </DroppableListDay>
            ) : (
              <div
                key={date.toISOString()}
                className={`p-4 border rounded-lg ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className={`font-medium mb-3 ${
                  isToday ? 'text-blue-600' : 'text-foreground'
                }`}>
                  {date.toLocaleDateString([], {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                {postsForDay.length > 0 ? (
                  <div className="space-y-2">
                    {postsForDay.map((post) => {
                      const scheduledTime = post.scheduled_at ? new Date(post.scheduled_at) : null;
                      const timeString = scheduledTime ? scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                      
                      return (
                        <EditablePost
                          key={post.id}
                          post={post}
                          editMode={editMode}
                          shortTitle={post.title}
                          timeString={timeString}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic py-4">
                    No posts scheduled for this day
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const CalendarView = ({ posts, allContent, currentDate, setCurrentDate, onReschedule, editMode }: {
  posts: ScheduledContent[];
  allContent: ScheduledContent[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onReschedule: (postId: string, newDate: Date) => void;
  editMode: boolean;
}) => {

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
            <div key={`empty-${i}`} className="h-32"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const postsForDay = getPostsForDate(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();
            
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            return editMode ? (
              <DroppableDay
                key={day}
                date={dayDate}
                className={`h-32 border rounded-lg p-1 ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-600' : 'text-foreground'
                }`}>
                  {day}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {postsForDay.slice(0, 4).map((post, index) => {
                    const scheduledTime = post.scheduled_at ? new Date(post.scheduled_at) : null;
                    const timeString = scheduledTime ? scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                    const shortTitle = post.title.length > 8 ? `${post.title.substring(0, 8)}...` : post.title;
                    
                     return (
                       <DraggablePost key={post.id} post={post} editMode={editMode}>
                         <EditablePost
                           post={post}
                           editMode={editMode}
                           shortTitle={shortTitle}
                           timeString={timeString}
                         />
                       </DraggablePost>
                     )
                  })}
                  {postsForDay.length > 4 && (
                    <div className="text-[10px] text-muted-foreground font-medium px-1 py-0.5 bg-muted/50 rounded text-center border border-dashed border-muted-foreground/30">
                      +{postsForDay.length - 4} more
                    </div>
                  )}
                </div>
              </DroppableDay>
            ) : (
              <div
                key={day}
                className={`h-32 border rounded-lg p-1 ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-600' : 'text-foreground'
                }`}>
                  {day}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {postsForDay.slice(0, 4).map((post) => {
                    const scheduledTime = post.scheduled_at ? new Date(post.scheduled_at) : null;
                    const timeString = scheduledTime ? scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                    const shortTitle = post.title.length > 8 ? `${post.title.substring(0, 8)}...` : post.title;
                    
                     return (
                       <EditablePost
                         key={post.id}
                         post={post}
                         editMode={editMode}
                         shortTitle={shortTitle}
                         timeString={timeString}
                       />
                     )
                  })}
                  {postsForDay.length > 4 && (
                    <div className="text-[10px] text-muted-foreground font-medium px-1 py-0.5 bg-muted/50 rounded text-center border border-dashed border-muted-foreground/30">
                      +{postsForDay.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const ContentScheduling = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { content, isLoading, getContentByStatus, deleteContent, updateContent } = useScheduledContent();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Minimal movement to start drag - much more responsive
      },
    }),
    useSensor(KeyboardSensor)
  );

  const draggedPost = activeId ? content.find(p => p.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !draggedPost) {
      return;
    }

    // Extract target date from drop zone ID
    const targetDropId = over.id as string;
    let targetDateStr: string;
    
    if (targetDropId.startsWith('list-')) {
      targetDateStr = targetDropId.replace('list-', '');
    } else {
      targetDateStr = targetDropId;
    }

    try {
      const [year, month, day] = targetDateStr.split('-').map(Number);
      if (!year || !month || !day) {
        throw new Error('Invalid date format');
      }

      const newDate = new Date(year, month - 1, day);
      
      // Preserve the original time
      const originalDate = new Date(draggedPost.scheduled_at);
      newDate.setHours(originalDate.getHours());
      newDate.setMinutes(originalDate.getMinutes());
      newDate.setSeconds(originalDate.getSeconds());

      // Check if the date actually changed (compare just the date part)
      const originalDateOnly = originalDate.toDateString();
      const newDateOnly = newDate.toDateString();
      
      if (originalDateOnly === newDateOnly) {
        // No actual date change, don't update or show notification
        return;
      }

      handleReschedule(draggedPost.id, newDate);
    } catch (error) {
      console.error('Error parsing target date:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid drop target. Please try again.",
      });
    }
  };

  const handleReschedule = async (postId: string, newDate: Date) => {
    const success = await updateContent(postId, {
      scheduled_at: newDate.toISOString()
    });

    if (success) {
      toast({
        title: "Content Rescheduled",
        description: `Post has been moved to ${newDate.toLocaleDateString()} at ${newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      });
    }
  };

  const getDraggedPost = () => {
    if (!activeId) return null;
    return content.find(p => p.id === activeId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Scheduling</h1>
          <p className="text-muted-foreground">Loading your scheduled content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Content Scheduling</h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Schedule and manage your social media content across all platforms.</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Read Mode</span>
              <Switch
                checked={editMode}
                onCheckedChange={setEditMode}
                aria-label="Toggle edit mode"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {editMode ? 'Edit, drag & drop' : 'Hover to view details'}
            </span>
          </div>
        </div>
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

      {editMode ? (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {viewMode === 'calendar' ? (
            <CalendarView 
              posts={content.filter(post => post.scheduled_at)} 
              allContent={content}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onReschedule={handleReschedule}
              editMode={editMode}
            />
          ) : (
            <ListView 
              posts={content.filter(post => post.scheduled_at)} 
              allContent={content}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onReschedule={handleReschedule}
              editMode={editMode}
            />
          )}
          <DragOverlay>
            {activeId ? (
              <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-lg opacity-90">
                <div className="text-sm font-medium">
                  {getDraggedPost()?.title || 'Moving post...'}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        // When edit mode is disabled, render without DndContext to enable hover
        viewMode === 'calendar' ? (
          <CalendarView 
            posts={content.filter(post => post.scheduled_at)} 
            allContent={content}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onReschedule={handleReschedule}
            editMode={editMode}
          />
        ) : (
          <ListView 
            posts={content.filter(post => post.scheduled_at)} 
            allContent={content}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onReschedule={handleReschedule}
            editMode={editMode}
          />
        )
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>
            Overview of your content scheduling activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{content.filter(post => post.status === 'scheduled').length}</div>
              <div className="text-sm text-blue-700">Scheduled Posts</div>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{content.filter(post => post.status === 'published').length}</div>
              <div className="text-sm text-green-700">Published Posts</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{new Set(content.map(post => post.platform)).size}</div>
              <div className="text-sm text-purple-700">Active Platforms</div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{content.filter(post => post.status === 'draft').length}</div>
              <div className="text-sm text-orange-700">Draft Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentScheduling;