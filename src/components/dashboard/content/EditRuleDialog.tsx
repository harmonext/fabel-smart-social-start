import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlatformRule } from '@/types/platformRules';

interface EditRuleDialogProps {
  ruleId: string;
  rule: PlatformRule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<PlatformRule>) => Promise<void>;
}

export const EditRuleDialog = ({
  rule,
  open,
  onOpenChange,
  onUpdate
}: EditRuleDialogProps) => {
  const [ruleValue, setRuleValue] = useState(JSON.stringify(rule.rule_value, null, 2));
  const [description, setDescription] = useState(rule.description || '');
  const [isActive, setIsActive] = useState(rule.is_active);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      let parsedValue;
      try {
        parsedValue = JSON.parse(ruleValue);
      } catch (e) {
        alert('Invalid JSON format');
        return;
      }

      await onUpdate({
        rule_value: parsedValue,
        description,
        is_active: isActive
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Platform Rule</DialogTitle>
          <DialogDescription>
            Customize the content constraint for {rule.platform}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Input 
              value={rule.platform.charAt(0).toUpperCase() + rule.platform.slice(1)} 
              disabled 
            />
          </div>

          <div className="space-y-2">
            <Label>Rule Name</Label>
            <Input 
              value={rule.rule_name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} 
              disabled 
            />
          </div>

          <div className="space-y-2">
            <Label>Rule Value (JSON)</Label>
            <Textarea
              value={ruleValue}
              onChange={(e) => setRuleValue(e.target.value)}
              rows={6}
              className="font-mono text-sm"
              placeholder='{"value": 2200}'
            />
            <p className="text-xs text-muted-foreground">
              Edit the JSON value. Common formats: {`{"value": 100}`} or {`{"values": ["1:1", "16:9"]}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what this rule enforces..."
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label>Active Rule</Label>
              <p className="text-xs text-muted-foreground">
                Inactive rules won't be enforced in validation
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            style={{ backgroundColor: 'rgb(227,195,138)', color: 'white' }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
