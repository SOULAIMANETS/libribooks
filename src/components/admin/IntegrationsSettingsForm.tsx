
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
import { Separator } from "../ui/separator";
import { Copy } from "lucide-react";
import { settingsService } from "@/lib/services";


const formSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  customApiKey: z.string().optional(),
});

type IntegrationsSettingsFormValues = z.infer<typeof formSchema>;


export function IntegrationsSettingsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const defaultValues = {
    googleAnalyticsId: "",
    facebookPixelId: "",
    customApiKey: "",
  }

  const form = useForm<IntegrationsSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.get('integrations');
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


  const handleSubmit = async (values: IntegrationsSettingsFormValues) => {
    try {
      await settingsService.upsert('integrations', values);
      toast({
        title: `Integration settings updated!`,
        description: `Your integration settings have been successfully saved.`,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: text,
    });
  }

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics ID</FormLabel>
                  <FormControl>
                    <Input placeholder="G-XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Google Analytics 4 measurement ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebookPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Pixel ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Pixel ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Facebook (Meta) Pixel ID for tracking.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Keys</h3>
          <FormField
            control={form.control}
            name="customApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom API Key</FormLabel>
                <FormControl>
                  <Input placeholder="sk-..." {...field} />
                </FormControl>
                <FormDescription>
                  A generic API key for custom integrations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Webhooks</h3>
          <FormDescription>
            Use these URLs to trigger actions in external services like Zapier or n8n when events happen on your site.
          </FormDescription>
          <div className="space-y-2 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm">POST /api/webhooks/new-review</p>
                <p className="text-xs text-muted-foreground">Triggered when a new book review is added.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => copyToClipboard('/api/webhooks/new-review')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
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
