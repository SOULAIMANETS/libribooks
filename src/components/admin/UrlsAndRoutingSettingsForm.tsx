
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
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";


const formSchema = z.object({
  baseUrl: z.string().url({ message: "Please enter a valid URL." }),
  permalinkStructure: z.enum(["book", "review"]).default("book"),
  enableCanonical: z.boolean().default(true),
});

type UrlsAndRoutingSettingsFormValues = z.infer<typeof formSchema>;


export function UrlsAndRoutingSettingsForm() {
  const { toast } = useToast();

  const currentSettings = {
    baseUrl: "https://libribooks.com",
    permalinkStructure: "book" as const,
    enableCanonical: true,
  }

  const form = useForm<UrlsAndRoutingSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: currentSettings,
  });

  const handleSubmit = (values: UrlsAndRoutingSettingsFormValues) => {
    // In a real application, you would save these settings and re-generate routes if needed.
    console.log(values);

    toast({
      title: `Routing settings updated!`,
      description: `Your URL and routing settings have been successfully saved.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="baseUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                The main address of your website. Used for generating absolute links.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="permalinkStructure"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Book URL Structure</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="book" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      <code>/book/book-title-slug</code>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="review" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      <code>/review/book-title-slug</code>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
               <FormDescription>
                Choose the preferred URL format for your book detail pages.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="enableCanonical"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Auto-generate Canonical URLs
                </FormLabel>
                <FormDescription>
                  Help prevent duplicate content issues by adding a canonical link to pages.
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
