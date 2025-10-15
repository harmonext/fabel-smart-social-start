import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { RuleValidationResult } from '@/types/platformRules';

interface ValidationStep {
  label: string;
  status: 'pending' | 'checking' | 'complete' | 'error';
  error?: string;
}

interface ContentValidationProgressProps {
  validation: RuleValidationResult | null;
  platform: string;
  isValidating: boolean;
  onComplete?: () => void;
}

export const ContentValidationProgress = ({ 
  validation, 
  platform,
  isValidating,
  onComplete 
}: ContentValidationProgressProps) => {
  const [steps, setSteps] = useState<ValidationStep[]>([
    { label: 'Checking caption length', status: 'pending' },
    { label: 'Verifying hashtags', status: 'pending' },
    { label: 'Validating media requirements', status: 'pending' },
    { label: 'Checking posting limits', status: 'pending' }
  ]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [failedStep, setFailedStep] = useState<number | null>(null);

  useEffect(() => {
    if (!isValidating) {
      setProgress(0);
      setCurrentStep(-1);
      setFailedStep(null);
      setSteps(steps.map(s => ({ ...s, status: 'pending', error: undefined })));
      return;
    }

    const totalSteps = steps.length;
    let step = 0;

    const interval = setInterval(() => {
      if (step < totalSteps && failedStep === null) {
        setCurrentStep(step);
        setSteps(prev => prev.map((s, idx) => {
          if (idx < step) return { ...s, status: 'complete' };
          if (idx === step) return { ...s, status: 'checking' };
          return s;
        }));
        
        setProgress(((step + 1) / totalSteps) * 100);
        
        // Check if this step failed
        if (validation && step < totalSteps) {
          const stepHasError = validation.violations.some(v => {
            const lowerMsg = v.message.toLowerCase();
            if (step === 0) return lowerMsg.includes('length') || lowerMsg.includes('character');
            if (step === 1) return lowerMsg.includes('hashtag');
            if (step === 2) return lowerMsg.includes('media') || lowerMsg.includes('image') || lowerMsg.includes('video');
            if (step === 3) return lowerMsg.includes('limit') || lowerMsg.includes('post');
            return false;
          });
          
          if (stepHasError) {
            const errorMsg = validation.violations.find(v => {
              const lowerMsg = v.message.toLowerCase();
              if (step === 0) return lowerMsg.includes('length') || lowerMsg.includes('character');
              if (step === 1) return lowerMsg.includes('hashtag');
              if (step === 2) return lowerMsg.includes('media') || lowerMsg.includes('image') || lowerMsg.includes('video');
              if (step === 3) return lowerMsg.includes('limit') || lowerMsg.includes('post');
              return false;
            })?.message;
            
            setSteps(prev => prev.map((s, idx) => 
              idx === step ? { ...s, status: 'error', error: errorMsg } : s
            ));
            setFailedStep(step);
            clearInterval(interval);
            onComplete?.();
            return;
          }
        }
        
        step++;
      } else if (failedStep === null) {
        clearInterval(interval);
        setSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));
        setProgress(100);
        onComplete?.();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isValidating, validation]);

  const showValidation = !isValidating && validation;
  const hasError = failedStep !== null;
  const currentStepData = currentStep >= 0 ? steps[currentStep] : null;

  return (
    <div className="space-y-3 p-4 rounded-lg border-2 border-fabel-primary bg-gradient-to-r from-fabel-primary/5 to-fabel-secondary/5">
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-2 transition-all duration-500"
        />
        
        {/* Only show current step being validated */}
        {isValidating && currentStepData && (
          <div className="flex items-center gap-3 text-sm animate-in fade-in slide-in-from-left-2 duration-300">
            <Loader2 className="h-4 w-4 animate-spin text-fabel-primary flex-shrink-0" />
            <span className="font-medium text-foreground">
              {currentStepData.label}
            </span>
          </div>
        )}
        
        {/* Show error if validation failed */}
        {showValidation && hasError && failedStep !== null && (
          <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-destructive mb-2">
                  Validation Failed: {steps[failedStep].label}
                </p>
                {steps[failedStep].error && (
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">Rule violation:</span> {steps[failedStep].error}
                  </p>
                )}
                {!steps[failedStep].error && validation && validation.violations.length > 0 && (
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">Rule violation:</span> {validation.violations[0].message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Show success if all checks passed */}
        {showValidation && !hasError && validation?.isValid && (
          <div className="flex items-center gap-3 text-sm animate-in fade-in slide-in-from-left-2 duration-300">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="font-medium text-green-600">
              All validation checks passed - Ready to post!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
