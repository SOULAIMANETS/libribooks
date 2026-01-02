import React from 'react';
import {
  GeneralSettings,
  GeneralSettingsFormValues,
} from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Placeholder for the useSettingsForm hook, adapted for GeneralSettings
const useGeneralSettingsForm = (
  initialValues: GeneralSettingsFormValues,
  onSubmit: (values: GeneralSettingsFormValues) => void
) => {
  const [values, setValues] = React.useState<GeneralSettingsFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (field: keyof GeneralSettingsFormValues, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Basic validation
      if (!values.siteName) {
        throw new Error('Site Name is required.');
      }
      // In a real app, you would fetch data here using SETTINGS_ENDPOINTS or similar
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
const initialGeneralSettings: GeneralSettingsFormValues = {
  siteName: 'My Awesome Blog',
  tagline: 'Your source for amazing content',
  supportEmail: 'support@example.com',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
};

export function GeneralSettingsForm() {
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
  } = useGeneralSettingsForm(initialGeneralSettings, async (formValues) => {
    console.log('Saving General Settings:', formValues);
    // Here you would typically make an API call to save the settings
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    alert('General settings saved successfully!');
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={values.siteName}
            onChange={(e) => handleChange('siteName', e.target.value)}
            placeholder="e.g., 'My Awesome Blog'"
            required
          />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={values.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="e.g., 'Your source for amazing content'"
          />
        </div>
        <div>
          <Label htmlFor="supportEmail">Support Email</Label>
          <Input
            id="supportEmail"
            type="email"
            value={values.supportEmail}
            onChange={(e) => handleChange('supportEmail', e.target.value)}
            placeholder="e.g., 'support@example.com'"
          />
        </div>
        <div>
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            value={values.logoUrl}
            onChange={(e) => handleChange('logoUrl', e.target.value)}
            placeholder="e.g., '/logo.png'"
          />
        </div>
        <div>
          <Label htmlFor="faviconUrl">Favicon URL</Label>
          <Input
            id="faviconUrl"
            value={values.faviconUrl}
            onChange={(e) => handleChange('faviconUrl', e.target.value)}
            placeholder="e.g., '/favicon.ico'"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
