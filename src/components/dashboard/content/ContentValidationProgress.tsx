import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { RuleValidationResult } from '@/types/platformRules';

interface ValidationStep {
  label: string;
  status: 'pending' | 'checking' | 'complete' | 'error';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isValidating) {
      setProgress(0);
      setCurrentStep(0);
      setSteps(steps.map(s => ({ ...s, status: 'pending' })));
      return;
    }

    const totalSteps = steps.length;
    let step = 0;

    const interval = setInterval(() => {
      if (step < totalSteps) {
        setSteps(prev => prev.map((s, idx) => {
          if (idx < step) return { ...s, status: 'complete' };
          if (idx === step) return { ...s, status: 'checking' };
          return s;
        }));
        setCurrentStep(step);
        setProgress(((step + 1) / totalSteps) * 100);
        step++;
      } else {
        clearInterval(interval);
        setSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));
        setProgress(100);
        onComplete?.();
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isValidating]);

  const getFinalStatus = () => {
    if (!validation) return null;
    if (validation.violations.length > 0) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-destructive" />,
        text: 'Needs Edits',
        color: 'text-destructive'
      };
    }
    return {
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      text: 'Ready for Posting',
      color: 'text-green-600'
    };
  };

  const finalStatus = getFinalStatus();
  const showFinalStatus = !isValidating && validation && progress === 100;

  return (
    <div className="space-y-4 p-6 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            Validating for {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </h3>
          {isValidating && (
            <p className="text-sm text-muted-foreground mt-1">
              {steps[currentStep]?.label}
            </p>
          )}
        </div>
        {showFinalStatus && finalStatus && (
          <div className={`flex items-center gap-2 font-semibold ${finalStatus.color}`}>
            {finalStatus.icon}
            <span>{finalStatus.text}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Progress 
          value={progress} 
          className="h-2 transition-all duration-500"
        />
        
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                step.status === 'pending' ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {step.status === 'checking' && (
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'rgb(227, 195, 138)' }} />
              )}
              {step.status === 'complete' && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              {step.status === 'pending' && (
                <div className="h-4 w-4 rounded-full border-2 border-muted" />
              )}
              <span className={step.status === 'checking' ? 'font-medium' : ''}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showFinalStatus && validation && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Validation Summary</span>
            <div className="flex gap-4">
              {validation.violations.length > 0 && (
                <span className="text-destructive font-medium">
                  {validation.violations.length} violation{validation.violations.length !== 1 ? 's' : ''}
                </span>
              )}
              {validation.warnings.length > 0 && (
                <span className="text-yellow-600 font-medium">
                  {validation.warnings.length} warning{validation.warnings.length !== 1 ? 's' : ''}
                </span>
              )}
              {validation.isValid && validation.warnings.length === 0 && (
                <span className="text-green-600 font-medium">All checks passed</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
