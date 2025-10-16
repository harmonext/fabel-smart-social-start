import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Clock, Upload, Image, Video, FileText, Trash2 } from 'lucide-react';
import { ScheduledContent, useScheduledContent } from '@/hooks/useScheduledContent';
import { usePlatformRules } from '@/hooks/usePlatformRules';
import { useSignedUrls } from '@/hooks/useSignedUrls';
import { validateContent } from '@/utils/contentValidation';
import { validateMediaFile } from '@/utils/mediaValidation';
import { ContentValidationProgress } from './ContentValidationProgress';
import { RuleValidationResult } from '@/types/platformRules';
import { useToast } from '@/hooks/use-toast';

// Import utility functions (we'll need to move these to a shared file)
const getSocialIcon = (platform: string, size: 'xs' | 'sm' | 'md' = 'sm') => {
  const sizeClasses = size === 'xs' ? "h-2 w-2" : size === 'sm' ? "h-3 w-3" : "h-4 w-4";
  const iconProps = { className: sizeClasses };
  switch (platform.toLowerCase()) {
    case 'facebook': return <div className={`${sizeClasses} bg-blue-600 rounded flex items-center justify-center`}><span className="text-white text-xs font-bold">f</span></div>;
    case 'instagram': return <div className={`${sizeClasses} bg-pink-600 rounded flex items-center justify-center`}><span className="text-white text-xs font-bold">I</span></div>;
    case 'linkedin': return <div className={`${sizeClasses} bg-blue-700 rounded flex items-center justify-center`}><span className="text-white text-xs font-bold">in</span></div>;
    case 'twitter': return <div className={`${sizeClasses} bg-blue-400 rounded flex items-center justify-center`}><span className="text-white text-xs font-bold">T</span></div>;
    case 'pinterest': return <div className={`${sizeClasses} bg-red-600 rounded-full flex items-center justify-center`}><span className="text-white text-xs font-bold">P</span></div>;
    case 'tiktok': return <div className={`${sizeClasses} bg-black rounded flex items-center justify-center`}><span className="text-white text-xs font-bold">TT</span></div>;
    case 'youtube': return <div className={`${sizeClasses} bg-red-600 rounded flex items-center justify-center`}><span className="text-white text-xs font-bold">▶</span></div>;
    default: return <div className={`${sizeClasses} bg-gray-500 rounded flex items-center justify-center`}><span className="text-white text-xs font-bold">?</span></div>;
  }
};

const getPersonaColor = (personaName: string, variant: 'light' | 'dark' = 'light') => {
  if (!personaName) return variant === 'light' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-gray-800 text-gray-300 border-gray-600';
  
  const colors = [
    { light: 'bg-blue-50 text-blue-600 border-blue-200', dark: 'bg-blue-900 text-blue-300 border-blue-600' },
    { light: 'bg-green-50 text-green-600 border-green-200', dark: 'bg-green-900 text-green-300 border-green-600' },
    { light: 'bg-purple-50 text-purple-600 border-purple-200', dark: 'bg-purple-900 text-purple-300 border-purple-600' },
    { light: 'bg-orange-50 text-orange-600 border-orange-200', dark: 'bg-orange-900 text-orange-300 border-orange-600' },
    { light: 'bg-pink-50 text-pink-600 border-pink-200', dark: 'bg-pink-900 text-pink-300 border-pink-600' },
    { light: 'bg-indigo-50 text-indigo-600 border-indigo-200', dark: 'bg-indigo-900 text-indigo-300 border-indigo-600' },
  ];
  
  const hash = personaName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex][variant];
};

const getPersonaAvatar = (personaName: string) => {
  if (!personaName) return '?';
  return personaName.charAt(0).toUpperCase();
};

interface EditPostDialogProps {
  post: ScheduledContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (postId: string, updates: Partial<ScheduledContent>) => void;
}

export const EditPostDialog: React.FC<EditPostDialogProps> = ({
  post,
  open,
  onOpenChange,
  onSave
}) => {
  const { uploadMedia } = useScheduledContent();
  const { rules } = usePlatformRules();
  const { getSignedUrl } = useSignedUrls();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    scheduled_at: '',
    status: 'draft' as 'draft' | 'scheduled' | 'published',
    media_url: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validation, setValidation] = useState<RuleValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [signedMediaUrl, setSignedMediaUrl] = useState<string>('');

  useEffect(() => {
    if (post && open) {
      setEditData({
        title: post.title,
        content: post.content || '',
        scheduled_at: post.scheduled_at || '',
        status: post.status as 'draft' | 'scheduled' | 'published',
        media_url: post.media_url || ''
      });
      setHasChanges(false);
      setValidation(null);
      setIsValidating(false);
      
      // Get signed URL for media if it exists
      if (post.media_url) {
        const extractPath = (url: string) => {
          const match = url.match(/scheduled-content-media\/(.+)/);
          return match ? match[1] : null;
        };
        
        const path = extractPath(post.media_url);
        if (path) {
          getSignedUrl(path).then(signedUrl => {
            setSignedMediaUrl(signedUrl);
          }).catch(err => {
            console.error('Error getting signed URL:', err);
            setSignedMediaUrl(post.media_url || '');
          });
        } else {
          setSignedMediaUrl(post.media_url);
        }
      } else {
        setSignedMediaUrl('');
      }
    }
  }, [post, open, getSignedUrl]);

  const handleChange = async (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Auto-save title and scheduled_at changes
    if ((field === 'title' || field === 'scheduled_at') && post) {
      await onSave(post.id, { [field]: value });
    }
  };

  const triggerValidation = (content: string, mediaUrl: string) => {
    if (!post) return;
    
    setIsValidating(true);
    setValidation(null);
    
    // Simulate async validation with slight delay for better UX
    setTimeout(() => {
      const result = validateContent(
        {
          content: content,
          platform: post.platform as any,
          media_url: mediaUrl || undefined
        },
        rules
      );
      
      setValidation(result);
      setIsValidating(false);
    }, 100);
  };

  const handleSave = async () => {
    if (!post || !hasChanges) return;

    // Reset validation state and trigger new validation
    setIsValidating(true);
    setValidation(null);

    // Validate content first
    const result = validateContent(
      {
        content: editData.content,
        platform: post.platform as any,
        media_url: editData.media_url || undefined
      },
      rules
    );

    // Show validation animation
    setTimeout(async () => {
      setValidation(result);
      setIsValidating(false);

      if (result.isValid) {
        // Save the updated content to database
        await onSave(post.id, editData);
        onOpenChange(false);
      }
    }, 1500);
  };

  const handleCancel = () => {
    if (post) {
      setEditData({
        title: post.title,
        content: post.content || '',
        scheduled_at: post.scheduled_at || '',
        status: post.status as 'draft' | 'scheduled' | 'published',
        media_url: post.media_url || ''
      });
      setHasChanges(false);
    }
    onOpenChange(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !post) return;

    setIsUploading(true);
    
    try {
      // Validate file before uploading
      const validationResult = await validateMediaFile(file, post.platform, true);
      
      // If file doesn't meet requirements, show persistent error and stop
      if (!validationResult.isValid) {
        toast({
          title: "File Upload Failed",
          description: validationResult.error,
          variant: "destructive",
          duration: Infinity
        });
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // File meets requirements - proceed with upload
      const mediaUrl = await uploadMedia(file, post.id);
      if (mediaUrl) {
        // Get signed URL for preview
        const extractPath = (url: string) => {
          const match = url.match(/scheduled-content-media\/(.+)/);
          return match ? match[1] : null;
        };
        
        const path = extractPath(mediaUrl);
        let signedUrl = mediaUrl;
        if (path) {
          signedUrl = await getSignedUrl(path);
        }
        
        // Update state with both media URL and signed URL for preview
        setSignedMediaUrl(signedUrl);
        handleChange('media_url', mediaUrl);
        
        // Auto-save the changes to database
        await onSave(post.id, { ...editData, media_url: mediaUrl });
        
        // Show recommendation toast if there's one, otherwise show success
        if (validationResult.recommendation) {
          toast({
            title: "File Uploaded and Saved",
            description: validationResult.recommendation,
            variant: "default",
            duration: 5000
          });
        } else {
          toast({
            title: "File Uploaded and Saved",
            description: `Your ${file.type.startsWith('image/') ? 'image' : 'video'} has been uploaded successfully.`,
            variant: "default",
            duration: 3000
          });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Error",
        description: "An error occurred during upload. Please try again.",
        variant: "destructive",
        duration: Infinity
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = () => {
    handleChange('media_url', '');
    setSignedMediaUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getMediaIcon = (url: string) => {
    if (!url) return <FileText className="h-4 w-4" />;
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="h-4 w-4" />;
    }
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) {
      return <Video className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        
        {/* Status Badge - Moved to top with brand colors */}
        <div className="flex items-center gap-3 pb-4 border-b">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange('status', 'draft')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                editData.status === 'draft'
                  ? 'bg-fabel-neutral text-foreground ring-2 ring-fabel-neutral ring-offset-2'
                  : 'bg-muted text-muted-foreground hover:bg-fabel-neutral/50'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => handleChange('status', 'scheduled')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                editData.status === 'scheduled'
                  ? 'bg-fabel-primary text-foreground ring-2 ring-fabel-primary ring-offset-2'
                  : 'bg-muted text-muted-foreground hover:bg-fabel-primary/50'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => handleChange('status', 'published')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                editData.status === 'published'
                  ? 'bg-fabel-secondary text-foreground ring-2 ring-fabel-secondary ring-offset-2'
                  : 'bg-muted text-muted-foreground hover:bg-fabel-secondary/50'
              }`}
            >
              Published
            </button>
          </div>
        </div>
        
        {/* Validation Progress - Show when validating or when there's a validation result */}
        {post && (isValidating || validation) && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <ContentValidationProgress
              validation={validation}
              platform={post.platform}
              isValidating={isValidating}
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium">Title</label>
            <Input
              value={editData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-xs h-8"
              placeholder="Post title..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Media Asset</label>
            <div className="space-y-2">
              {editData.media_url ? (
                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  {editData.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <div className="relative">
                      <img 
                        src={signedMediaUrl || editData.media_url} 
                        alt="Media preview" 
                        className="w-full h-64 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeMedia}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : editData.media_url.match(/\.(mp4|mov|avi|mkv)$/i) ? (
                    <div className="relative">
                      <video 
                        src={signedMediaUrl || editData.media_url} 
                        controls
                        className="w-full h-64 object-cover bg-black"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeMedia}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getMediaIcon(editData.media_url)}
                          <span className="text-sm font-medium">Media attached</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeMedia}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-12 border-dashed"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Media'}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Content</label>
            <Textarea
              value={editData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="text-xs min-h-[60px]"
              placeholder="Post content..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Scheduled Date & Time</label>
            <Input
              type="datetime-local"
              value={editData.scheduled_at ? new Date(editData.scheduled_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="text-xs h-8"
            />
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
          
          {validation && !validation.isValid && validation.violations.length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                Please fix {validation.violations.length} validation error{validation.violations.length > 1 ? 's' : ''} before saving
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isValidating || (validation ? !validation.isValid : false)}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              {isValidating ? 'Validating...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};