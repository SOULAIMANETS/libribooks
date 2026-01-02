import React from 'react';
import {
  RoutingSettings,
  RoutingSettingsFormValues,
} from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Placeholder for the useSettingsForm hook, adapted for RoutingSettings
const useRoutingSettingsForm = (
  initialValues: RoutingSettingsFormValues,
  onSubmit: (values: RoutingSettingsFormValues) => void
) => {
  const [values, setValues] = React.useState<RoutingSettingsFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (field: keyof RoutingSettingsFormValues, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Basic validation
      if (!values.baseUrl) {
        throw new Error('Base URL is required.');
      }
      await onSubmit(values);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving settings.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
  };
};

// Mock data for initial values
const initialRoutingSettings: RoutingSettingsFormValues = {
  baseUrl: '/',
  permalinkStructure: 'book',
  enableCanonical: true,
};

export function UrlsAndRoutingSettingsForm() {
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
  } = useRoutingSettingsForm(initialRoutingSettings, async (formValues) => {
    console.log('Saving Routing Settings:', formValues);
    // Here you would typically make an API call to save the settings
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    alert('Routing settings saved successfully!');
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="baseUrl">Base URL</Label>
          <Input
            id="baseUrl"
            value={values.baseUrl}
            onChange={(e) => handleChange('baseUrl', e.target.value)}
            placeholder="e.g., '/'"
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="permalinkStructure">Permalink Structure</Label>
          <Select
            onValueChange={(value) => handleChange('permalinkStructure', value)}
            defaultValue={values.permalinkStructure}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a structure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="review">Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 col-span-1 md:col-span-2">
          <Switch
            id="enableCanonical"
            checked={values.enableCanonical}
            onCheckedChange={(checked: boolean) => handleChange('enableCanonical', checked)}
          />
          <Label htmlFor="enableCanonical">Enable Canonical URLs</Label>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
