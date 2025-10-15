interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  recommendation?: string;
}

interface PlatformMediaRules {
  acceptedFormats: {
    image: string[];
    video: string[];
  };
  aspectRatios: {
    min: number;
    max: number;
    preferred?: number;
  };
}

const platformMediaRules: Record<string, PlatformMediaRules> = {
  instagram: {
    acceptedFormats: {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'mov']
    },
    aspectRatios: { min: 0.8, max: 1.91, preferred: 1 } // 4:5 to 1.91:1
  },
  facebook: {
    acceptedFormats: {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'mov', 'avi']
    },
    aspectRatios: { min: 0.8, max: 1.91 }
  },
  linkedin: {
    acceptedFormats: {
      image: ['jpg', 'jpeg', 'png', 'gif'],
      video: ['mp4', 'mov']
    },
    aspectRatios: { min: 1, max: 1.91, preferred: 1.91 }
  },
  twitter: {
    acceptedFormats: {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'mov']
    },
    aspectRatios: { min: 1, max: 1.78 } // 1:1 to 16:9
  },
  tiktok: {
    acceptedFormats: {
      image: ['jpg', 'jpeg', 'png'],
      video: ['mp4', 'mov']
    },
    aspectRatios: { min: 0.5625, max: 0.5625, preferred: 0.5625 } // 9:16 vertical
  },
  pinterest: {
    acceptedFormats: {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'mov']
    },
    aspectRatios: { min: 0.5, max: 0.67, preferred: 0.67 } // 2:3 vertical
  },
  youtube: {
    acceptedFormats: {
      image: ['jpg', 'jpeg', 'png'],
      video: ['mp4', 'mov', 'avi', 'mkv']
    },
    aspectRatios: { min: 1.78, max: 1.78, preferred: 1.78 } // 16:9
  }
};

export const validateMediaFile = async (
  file: File,
  platform: string,
  showRecommendation: boolean = true
): Promise<MediaValidationResult> => {
  const platformLower = platform.toLowerCase();
  const rules = platformMediaRules[platformLower];

  if (!rules) {
    return { isValid: true }; // No rules defined, allow upload
  }

  // Check file type
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  const acceptedFormats = isImage
    ? rules.acceptedFormats.image
    : isVideo
    ? rules.acceptedFormats.video
    : [];

  if (!acceptedFormats.includes(extension)) {
    const formatList = [
      ...rules.acceptedFormats.image.map(f => f.toUpperCase()),
      ...rules.acceptedFormats.video.map(f => f.toUpperCase())
    ].join(', ');
    return {
      isValid: false,
      error: `${platform} only accepts ${formatList} files. Your file is .${extension.toUpperCase()}`
    };
  }

  // Check dimensions for images and provide recommendation (not blocking)
  if (isImage && rules.aspectRatios.preferred && showRecommendation) {
    try {
      const dimensions = await getImageDimensions(file);
      const aspectRatio = dimensions.width / dimensions.height;
      const preferred = rules.aspectRatios.preferred;

      // If there's a preferred ratio and image doesn't match, show recommendation
      if (Math.abs(aspectRatio - preferred) > 0.1) {
        const preferredRatioDisplay = preferred === 0.67 ? '2:3' : 
                                       preferred === 1 ? '1:1' : 
                                       preferred === 1.91 ? '1.91:1' : 
                                       preferred === 0.5625 ? '9:16' :
                                       preferred === 1.78 ? '16:9' :
                                       `${Math.round(preferred * 100)}:100`;
        
        return {
          isValid: true,
          recommendation: `For best results on ${platform}, we recommend using a ${preferredRatioDisplay} aspect ratio`
        };
      }
    } catch (error) {
      console.error('Error checking image dimensions:', error);
    }
  }

  return { isValid: true };
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};
