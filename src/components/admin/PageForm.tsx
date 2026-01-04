
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import React from "react";

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

const faqItemSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
  answer: z.string().min(1, "Answer cannot be empty."),
});

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  content: z.string().min(1, { message: "Content cannot be empty." }),
  structuredContent: z.array(faqItemSchema).optional(),
});

type PageFormValues = z.infer<typeof formSchema>;

interface PageFormProps {
  initialData: Page;
  onSubmit: (data: Page) => void;
  onSuccess?: () => void;
}

export function PageForm({ initialData, onSubmit, onSuccess }: PageFormProps) {
  const { toast } = useToast();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      content: initialData.content || "",
      structuredContent: initialData.structuredContent || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "structuredContent",
  });

  const handleSubmit = (values: PageFormValues) => {
    onSubmit({ ...initialData, ...values });

    toast({
      title: "Page Updated!",
      description: `The content for "${values.title}" has been successfully saved.`,
    });

    onSuccess?.();
  };

  const isFaqPage = initialData.slug === 'faq';

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
              <FormLabel>Page Content {isFaqPage ? '(Introductory Text)' : '(HTML allowed)'}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isFaqPage ? "A short intro..." : "<p>Details about your company...</p>"}
                  rows={isFaqPage ? 5 : 15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isFaqPage && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-medium">FAQ Items</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                <FormField
                  control={form.control}
                  name={`structuredContent.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`structuredContent.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
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
              Add FAQ Item
            </Button>
          </div>
        )}

        <div className="flex justify-end pt-4">
            <Button type="submit">
                Update Page
            </Button>
        </div>
      </form>
    </Form>
  );
}
