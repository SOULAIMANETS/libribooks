
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { settingsService } from "@/lib/services";


const formSchema = z.object({
  siteName: z.string().min(2, { message: "Site name must be at least 2 characters." }),
  tagline: z.string().optional(),
  heroSubtitle: z.string().optional(),
  footerDescription: z.string().optional(),
  footerCreditsText: z.string().optional(),
  footerCreditsUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  supportEmail: z.string().email({ message: "Please enter a valid email address." }),
  logoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  faviconUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  socialLinks: z.object({
    twitter: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    pinterest: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

type GeneralSettingsFormValues = z.infer<typeof formSchema>;


export function GeneralSettingsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const defaultValues = {
    siteName: "libribooks.com",
    tagline: "Your friendly corner of the internet for discovering amazing books.",
    heroSubtitle: "Explore our collection or search for your next favorite read.",
    footerDescription: "Your friendly corner of the internet for discovering amazing books and sharing the love of reading.",
    footerCreditsText: "",
    footerCreditsUrl: "",
    supportEmail: "hello@libribooks.com",
    logoUrl: "",
    faviconUrl: "",
    socialLinks: {
      twitter: "",
      facebook: "",
      pinterest: "",
      youtube: "",
    }
  };

  const formMethods = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.get('general');
        if (settings) {
          formMethods.reset({
            ...defaultValues,
            ...settings,
            socialLinks: {
              ...defaultValues.socialLinks,
              ...(settings.socialLinks || {}),
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [formMethods]);

  const handleSubmit = async (values: GeneralSettingsFormValues) => {
    try {
      await settingsService.upsert('general', values);
      toast({
        title: `Settings updated!`,
        description: `Your general settings have been successfully saved.`,
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <FormProvider {...formMethods}>
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={formMethods.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Awesome Site" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Title (Tagline)</FormLabel>
                <FormControl>
                  <Input placeholder="A short, catchy description" {...field} />
                </FormControl>
                <FormDescription>
                  This will be displayed as the main title on the homepage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="heroSubtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Subtitle below the main title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="footerDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Footer Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description shown in the footer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Footer Credits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={formMethods.control}
                name="footerCreditsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits Text</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Developed by Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="footerCreditsUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={formMethods.control}
                name="socialLinks.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="socialLinks.facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="socialLinks.pinterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pinterest URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://pinterest.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="socialLinks.youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={formMethods.control}
            name="supportEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="support@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  The email address for user support inquiries.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <ImageUpload name="logoUrl" label="Logo (256x64px recommended)" currentValue={formMethods.watch('logoUrl')} />
          <FormDescription>The URL for your site's logo. Leave blank to use text name.</FormDescription>

          <ImageUpload name="faviconUrl" label="Favicon (32x32px recommended)" currentValue={formMethods.watch('faviconUrl')} />
          <FormDescription>The URL for your site's favicon (the small icon in the browser tab).</FormDescription>

          <div className="flex justify-end pt-4">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
