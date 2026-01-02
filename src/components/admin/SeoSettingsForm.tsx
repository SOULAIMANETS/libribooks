import React from 'react';
import {
  SeoSettings,
  SeoSettingsFormValues,
} from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Placeholder for the useSettingsForm hook, adapted for SeoSettings
const useSeoSettingsForm = (
  initialValues: SeoSettingsFormValues,
  onSubmit: (values: SeoSettingsFormValues) => void
) => {
  const [values, setValues] = React.useState<SeoSettingsFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (field: keyof SeoSettingsFormValues, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Basic validation
      if (!values.default_title) {
        throw new Error('Default Title is required.');
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
const initialSeoSettings: SeoSettingsFormValues = {
  default_title: 'My Awesome Blog',
  meta_description: 'Your source for amazing content and insights.',
  global_keywords: 'blog, content, insights, technology, lifestyle',
  enable_schema: true,
};

export function SeoSettingsForm() {
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
  } = useSeoSettingsForm(initialSeoSettings, async (formValues) => {
    console.log('Saving SEO Settings:', formValues);
    // Here you would typically make an API call to save the settings
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    alert('SEO settings saved successfully!');
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="default_title">Default Title</Label>
          <Input
            id="default_title"
            value={values.default_title}
            onChange={(e) => handleChange('default_title', e.target.value)}
            placeholder="e.g., 'My Awesome Blog'"
            required
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={values.meta_description}
            onChange={(e) => handleChange('meta_description', e.target.value)}
            placeholder="e.g., 'Your source for amazing content and insights.'"
            rows={3}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="global_keywords">Global Keywords</Label>
          <Textarea
            id="global_keywords"
            value={values.global_keywords}
            onChange={(e) => handleChange('global_keywords', e.target.value)}
            placeholder="e.g., 'blog, content, insights'"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2 col-span-1 md:col-span-2">
          <Switch
            id="enable_schema"
            checked={values.enable_schema}
            onCheckedChange={(checked) => handleChange('enable_schema', checked)}
          />
          <Label htmlFor="enable_schema">Enable Schema Markup</Label>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
