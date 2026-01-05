
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { appearanceSettings, fonts } from "@/lib/siteConfig";
import { settingsService } from "@/lib/services";

const formSchema = z.object({
  enableDarkMode: z.boolean().default(true),
  headlineFont: z.string().default("space_grotesk"),
  bodyFont: z.string().default("literata"),
  colorPrimary: z.string().min(2, { message: "Color value is required" }),
  colorBackground: z.string().min(2, { message: "Color value is required" }),
  colorAccent: z.string().min(2, { message: "Color value is required" }),
  quickLinks: z.string(),
  legalLinks: z.string(),
});

type AppearanceFormValues = z.infer<typeof formSchema>;

export function AppearanceSettingsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const defaultValues = {
    ...appearanceSettings,
    quickLinks: appearanceSettings.quickLinks.map(l => `${l.label},${l.href}`).join("\n"),
    legalLinks: appearanceSettings.legalLinks.map(l => `${l.label},${l.href}`).join("\n"),
  };

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.get('appearance');
        if (settings) {
          form.reset(settings);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [form]);

  const handleSubmit = async (values: AppearanceFormValues) => {
    try {
      await settingsService.upsert('appearance', values);
      toast({
        title: `Appearance settings updated!`,
        description: `Your appearance settings have been successfully saved.`,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="enableDarkMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable Dark Mode
                </FormLabel>
                <FormDescription>
                  Allow users to switch to a dark color scheme.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Fonts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="headlineFont"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline Font</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fonts.headline.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bodyFont"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Font</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fonts.body.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Colors</h3>
          <FormDescription>
            Enter HSL values for your site's main colors. E.g., <code>201 41% 55%</code>
          </FormDescription>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="colorPrimary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorAccent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Footer Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="quickLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quick Links</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormDescription>
                    One link per line. Format: <code>Label,URL</code>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="legalLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Links</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormDescription>
                    One link per line. Format: <code>Label,URL</code>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
