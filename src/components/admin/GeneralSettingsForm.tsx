
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
import { ImageUpload } from "./ImageUpload";


const formSchema = z.object({
  siteName: z.string().min(2, { message: "Site name must be at least 2 characters." }),
  tagline: z.string().optional(),
  supportEmail: z.string().email({ message: "Please enter a valid email address." }),
  logoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  faviconUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type GeneralSettingsFormValues = z.infer<typeof formSchema>;


export function GeneralSettingsForm() {
  const { toast } = useToast();

  const currentSettings = {
    siteName: "libribooks.com",
    tagline: "Your friendly corner of the internet for discovering amazing books.",
    supportEmail: "hello@libribooks.com",
    logoUrl: "",
    faviconUrl: "",
  }

  const formMethods = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: currentSettings,
  });

  const handleSubmit = (values: GeneralSettingsFormValues) => {
    console.log(values);

    toast({
      title: `Settings updated!`,
      description: `Your general settings have been successfully saved.`,
    });
  };

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
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input placeholder="A short, catchy description" {...field} />
              </FormControl>
               <FormDescription>
                A short, catchy description of your website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        
        <ImageUpload name="logoUrl" label="Logo (256x64px recommended)" currentValue={currentSettings.logoUrl} />
        <FormDescription>The URL for your site's logo. Leave blank to use text name.</FormDescription>

        <ImageUpload name="faviconUrl" label="Favicon (32x32px recommended)" currentValue={currentSettings.faviconUrl} />
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
