"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Page } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";

const structuredContentItemSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
  answer: z.string().min(1, "Answer cannot be empty."),
});

const structuredContentSchema = z.object({
  tagline: z.string().optional(),
  imageUrl: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  officeAddress: z.string().optional(),
  items: z.array(structuredContentItemSchema).optional(),
});

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  content: z.string().min(1, { message: "Content cannot be empty." }),
  structured_content: structuredContentSchema.optional(),
});

export type PageFormValues = z.infer<typeof formSchema>;

interface PageFormProps {
  initialData: Page;
  onSubmit: (data: PageFormValues) => void;
  onSuccess?: () => void;
}

export function PageForm({ initialData, onSubmit, onSuccess }: PageFormProps) {
  const { toast } = useToast();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      structured_content: {
        tagline: initialData?.structured_content?.tagline || "",
        imageUrl: initialData?.structured_content?.imageUrl || "",
        contactEmail: initialData?.structured_content?.contactEmail || "",
        contactPhone: initialData?.structured_content?.contactPhone || "",
        officeAddress: initialData?.structured_content?.officeAddress || "",
        items: initialData?.structured_content?.items || [],
      },
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        content: initialData.content || "",
        structured_content: {
          tagline: initialData.structured_content?.tagline || "",
          imageUrl: initialData.structured_content?.imageUrl || "",
          contactEmail: initialData.structured_content?.contactEmail || "",
          contactPhone: initialData.structured_content?.contactPhone || "",
          officeAddress: initialData.structured_content?.officeAddress || "",
          items: initialData.structured_content?.items || [],
        },
      });
    }
  }, [initialData, form.reset]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "structured_content.items",
  });

  const handleSubmit = useCallback((values: PageFormValues) => {
    onSubmit({ ...initialData, ...values });
    toast({
      title: "Page Updated!",
      description: `The content for "${values.title}" has been successfully saved.`,
    });
    onSuccess?.();
  }, [initialData, onSubmit, onSuccess, toast]);

  const renderPageSpecificFields = () => {
    switch (initialData.slug) {
      case "about":
        return (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-medium">About Page Details</h3>
            <FormField
              control={form.control}
              name="structured_content.tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="Your friendly corner of the internet..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="structured_content.imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-medium">Contact Information</h3>
            <FormField
              control={form.control}
              name="structured_content.contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="hello@libribooks.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="structured_content.contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="structured_content.officeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Bookworm Lane, Readington, RS 45678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "faq":
      case "terms":
      case "privacy-policy":
      case "cookie-policy":
        return (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-medium">Structured Content</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                <FormField
                  control={form.control}
                  name={`structured_content.items.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question / Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`structured_content.items.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer / Content</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ question: "", answer: "" })}
            >
              Add Item
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input placeholder="About Us" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Content / Introduction</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="<p>Details about your company...</p>"
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {renderPageSpecificFields()}

        <div className="flex justify-end pt-4">
            <Button type="submit">
                Update Page
            </Button>
        </div>
      </form>
    </Form>
  );
}
