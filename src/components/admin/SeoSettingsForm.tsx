
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React from "react";

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
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";


const formSchema = z.object({
  defaultTitle: z.string().min(2, { message: "Default title must be at least 2 characters." }),
  metaDescription: z.string().max(160, { message: "Description should be 160 characters or less."}).optional(),
  globalKeywords: z.string().optional(),
  enableSchema: z.boolean().default(true),
});

type SeoSettingsFormValues = z.infer<typeof formSchema>;


export function SeoSettingsForm() {
  const { toast } = useToast();

  const currentSettings = {
    defaultTitle: "libribooks.com | Your Next Literary Adventure",
    metaDescription: "Discover your next favorite book with our insightful reviews, articles, and author interviews.",
    globalKeywords: "book reviews, literature, fiction, non-fiction, author interviews",
    enableSchema: true,
  }

  const form = useForm<SeoSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: currentSettings,
  });

  const handleSubmit = (values: SeoSettingsFormValues) => {
    // In a real application, you would save these settings to your database
    // and use them to dynamically populate the <head> of your pages.
    console.log(values);

    toast({
      title: `SEO settings updated!`,
      description: `Your SEO settings have been successfully saved.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="defaultTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Title</FormLabel>
              <FormControl>
                <Input placeholder="Your Site Name | Tagline" {...field} />
              </FormControl>
              <FormDescription>
                The default title for your pages, used when a specific title isn't set.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief summary of what your site is about." {...field} />
              </FormControl>
              <FormDescription>
                Your site's default meta description (max 160 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="globalKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Global Keywords</FormLabel>
              <FormControl>
                <Input placeholder="books, reading, reviews, authors" {...field} />
              </FormControl>
               <FormDescription>
                Comma-separated keywords that describe your site's content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="enableSchema"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable Structured Data (Schema.org)
                </FormLabel>
                <FormDescription>
                  Automatically generate structured data for better search engine visibility.
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

        <div className="flex justify-end pt-4">
            <Button type="submit">
                Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}
