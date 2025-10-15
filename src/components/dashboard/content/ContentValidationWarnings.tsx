import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RuleValidationResult } from '@/types/platformRules';
import { Badge } from '@/components/ui/badge';

interface ContentValidationWarningsProps {
  validation: RuleValidationResult;
  platform: string;
}

export const ContentValidationWarnings = ({ validation, platform }: ContentValidationWarningsProps) => {
  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">Content looks good!</AlertTitle>
        <AlertDescription className="text-green-700">
          Your content meets all {platform.charAt(0).toUpperCase() + platform.slice(1)} requirements
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {/* Violations */}
      {validation.violations.map((violation, idx) => (
        <Alert key={`violation-${idx}`} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            Violation
            <Badge variant="destructive">{violation.rule_type}</Badge>
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="font-medium">{violation.message}</p>
            <div className="mt-2 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span>Current:</span>
                <code className="bg-destructive/10 px-2 py-0.5 rounded">
                  {formatValue(violation.current_value)}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span>Maximum:</span>
                <code className="bg-destructive/10 px-2 py-0.5 rounded">
                  {formatValue(violation.max_value)}
                </code>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}

      {/* Warnings */}
      {validation.warnings.map((warning, idx) => (
        <Alert key={`warning-${idx}`} className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="flex items-center gap-2 text-yellow-900">
            Warning
            <Badge variant="outline" className="border-yellow-300 text-yellow-700">
              {warning.rule_type}
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-yellow-800 mt-2">
            <p className="font-medium">{warning.message}</p>
            {warning.current_value !== 'unknown' && (
              <div className="mt-2 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span>Current:</span>
                  <code className="bg-yellow-100 px-2 py-0.5 rounded">
                    {formatValue(warning.current_value)}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recommended:</span>
                  <code className="bg-yellow-100 px-2 py-0.5 rounded">
                    {formatValue(warning.recommended_value)}
                  </code>
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

const formatValue = (value: any): string => {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};
