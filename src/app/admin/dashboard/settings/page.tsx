'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

// Define the structure for site settings
interface SiteSettings {
  siteName: string;
  welcomeMessage: string;
  welcomeText: string;
  aboutSite: string;
  socialMediaLinks: {
    twitter: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    // Add other social media platforms as needed
  };
}

// Initial state for settings
const initialSettings: SiteSettings = {
  siteName: '',
  welcomeMessage: '',
  welcomeText: '',
  aboutSite: '',
  socialMediaLinks: {
    twitter: '',
    facebook: '',
    youtube: '',
    linkedin: '',
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  // Fetch existing settings when the component mounts
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          if (response.status === 404) {
            // API doesn't exist yet, use default values
            console.log('Settings API not found, using default values');
            return;
          }
          throw new Error(`Failed to fetch settings: ${response.status}`);
        }
        const data: SiteSettings = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Use default values if API fails
        console.log('Using default settings due to API error');
        setSettings({
          siteName: 'libribooks.com',
          welcomeMessage: 'Welcome to LibriBooks!',
          welcomeText: 'Explore our vast collection of books and discover your next literary adventure.',
          aboutSite: 'LibriBooks is your friendly corner of the internet for discovering amazing books and sharing the love of reading.',
          socialMediaLinks: { twitter: '', facebook: '', youtube: '', linkedin: '' },
        });
        toast({
          title: 'Notice',
          description: 'Using default settings. You can modify them and save.',
        });
      }
    }
    fetchSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSocialInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      socialMediaLinks: {
        ...prevSettings.socialMediaLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/settings', { // Assuming an API endpoint to save settings
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully.',
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not save settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage your website's general information and social links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Input
                id="welcomeMessage"
                name="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="welcomeText">Welcome Text</Label>
              <Textarea
                id="welcomeText"
                name="welcomeText"
                value={settings.welcomeText}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="aboutSite">About Site</Label>
              <Textarea
                id="aboutSite"
                name="aboutSite"
                value={settings.aboutSite}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={settings.socialMediaLinks.twitter}
                    onChange={handleSocialInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={settings.socialMediaLinks.facebook}
                    onChange={handleSocialInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    value={settings.socialMediaLinks.youtube}
                    onChange={handleSocialInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={settings.socialMediaLinks.linkedin}
                    onChange={handleSocialInputChange}
                  />
                </div>
                {/* Add more social media inputs here */}
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
