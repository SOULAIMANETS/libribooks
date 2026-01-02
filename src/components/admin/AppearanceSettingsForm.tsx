import React from 'react';
import {
  AppearanceSettings,
  AppearanceSettingsFormValues,
  Link // Import Link type for clarity
} from '@/lib/types';
import { parseLinks, formatLinks, isValidHslColor } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Placeholder for the useSettingsForm hook, as it's not found.
// In a real scenario, this hook would handle form state, validation, and submission.
const useSettingsForm = (
  initialValues: AppearanceSettingsFormValues,
  onSubmit: (values: AppearanceSettingsFormValues) => void
) => {
  const [values, setValues] = React.useState<AppearanceSettingsFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (field: keyof AppearanceSettingsFormValues, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Basic validation example for colors
      if (values.colorPrimary && !isValidHslColor(values.colorPrimary)) {
        throw new Error('Primary color is not a valid HSL format (e.g., "201 41% 55%").');
      }
      if (values.colorBackground && !isValidHslColor(values.colorBackground)) {
        throw new Error('Background color is not a valid HSL format (e.g., "201 41% 55%").');
      }
      if (values.colorAccent && !isValidHslColor(values.colorAccent)) {
        throw new Error('Accent color is not a valid HSL format (e.g., "201 41% 55%").');
      }

      // In a real app, you would fetch data here using SETTINGS_ENDPOINTS or similar
      // For now, we just call the onSubmit prop
      await onSubmit(values);
      // Optionally, reset form or show success message
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
    setValues // Expose setValues to allow external updates if needed
  };
};

// Mock data for initial values, assuming these would be fetched
const initialAppearanceSettings: AppearanceSettingsFormValues = {
  enableDarkMode: false,
  headlineFont: 'Arial, sans-serif',
  bodyFont: 'Roboto, sans-serif',
  colorPrimary: '200 50% 50%', // Example HSL
  colorBackground: '220 20% 95%', // Example HSL
  colorAccent: '150 70% 40%', // Example HSL
  quickLinks: 'Home,/\nAbout Us,/about',
  legalLinks: 'Privacy Policy,/privacy-policy\nTerms of Service,/terms',
};

export function AppearanceSettingsForm() {
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
    setValues
  } = useSettingsForm(initialAppearanceSettings, async (formValues) => {
    console.log('Saving Appearance Settings:', formValues);
    // Here you would typically make an API call to save the settings
    // e.g., await fetch('/api/settings/appearance', { method: 'POST', body: JSON.stringify(formValues) });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    alert('Appearance settings saved successfully!');
  });

  // If you need to update the form from external data (e.g., fetched settings)
  // React.useEffect(() => {
  //   // Assume fetchedSettings is available
  //   // setValues({
  //   //   enableDarkMode: fetchedSettings.enable_dark_mode,
  //   //   headlineFont: fetchedSettings.headline_font,
  //   //   bodyFont: fetchedSettings.body_font,
  //   //   colorPrimary: fetchedSettings.color_primary,
  //   //   colorBackground: fetchedSettings.color_background,
  //   //   colorAccent: fetchedSettings.color_accent,
  //   //   quickLinks: formatLinks(fetchedSettings.quick_links),
  //   //   legalLinks: formatLinks(fetchedSettings.legal_links),
  //   // });
  // }, [fetchedSettings]);


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Dark Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="enableDarkMode"
            checked={values.enableDarkMode}
            onCheckedChange={(checked) => handleChange('enableDarkMode', checked)}
          />
          <Label htmlFor="enableDarkMode">Enable Dark Mode</Label>
        </div>

        {/* Font Inputs */}
        <div>
          <Label htmlFor="headlineFont">Headline Font</Label>
          <Input
            id="headlineFont"
            value={values.headlineFont}
            onChange={(e) => handleChange('headlineFont', e.target.value)}
            placeholder="e.g., 'Merriweather, serif'"
          />
        </div>
        <div>
          <Label htmlFor="bodyFont">Body Font</Label>
          <Input
            id="bodyFont"
            value={values.bodyFont}
            onChange={(e) => handleChange('bodyFont', e.target.value)}
            placeholder="e.g., 'Open Sans, sans-serif'"
          />
        </div>

        {/* Color Inputs */}
        <div>
          <Label htmlFor="colorPrimary">Primary Color (HSL)</Label>
          <Input
            id="colorPrimary"
            value={values.colorPrimary}
            onChange={(e) => handleChange('colorPrimary', e.target.value)}
            placeholder="e.g., '200 50% 50%'"
          />
        </div>
        <div>
          <Label htmlFor="colorBackground">Background Color (HSL)</Label>
          <Input
            id="colorBackground"
            value={values.colorBackground}
            onChange={(e) => handleChange('colorBackground', e.target.value)}
            placeholder="e.g., '220 20% 95%'"
          />
        </div>
        <div>
          <Label htmlFor="colorAccent">Accent Color (HSL)</Label>
          <Input
            id="colorAccent"
            value={values.colorAccent}
            onChange={(e) => handleChange('colorAccent', e.target.value)}
            placeholder="e.g., '150 70% 40%'"
          />
        </div>
      </div>

      {/* Links Textareas */}
      <div>
        <Label htmlFor="quickLinks">Quick Links (Label,URL per line)</Label>
        <Textarea
          id="quickLinks"
          value={values.quickLinks}
          onChange={(e) => handleChange('quickLinks', e.target.value)}
          placeholder="Example:
Home,/
About Us,/about"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="legalLinks">Legal Links (Label,URL per line)</Label>
        <Textarea
          id="legalLinks"
          value={values.legalLinks}
          onChange={(e) => handleChange('legalLinks', e.target.value)}
          placeholder="Example:
Privacy Policy,/privacy-policy
Terms of Service,/terms"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
