
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns';
import React from 'react';

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
import { Article } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  coverImage: z.string().min(1, { message: "Please upload an image." }),
  excerpt: z.string().min(20, { message: "Excerpt must be at least 20 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
});

type ArticleFormValues = z.infer<typeof formSchema>;

const defaultFormValues = {
  title: "",
  author: "Admin",
  date: format(new Date(), 'yyyy-MM-dd'),
  coverImage: "",
  excerpt: "",
  content: "",
};


interface ArticleFormProps {
  initialData?: Article | null;
  onSubmit: (data: Omit<Article, 'slug'> | Article) => void;
  onSuccess?: () => void;
}

export function ArticleForm({ initialData, onSubmit, onSuccess }: ArticleFormProps) {
  const { toast } = useToast();

  const formMethods = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: format(new Date(initialData.date), 'yyyy-MM-dd'),
    } : defaultFormValues,
  });

  React.useEffect(() => {
    if (initialData) {
      formMethods.reset({
        ...initialData,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
      });
    } else {
      formMethods.reset(defaultFormValues);
    }
  }, [initialData, formMethods]);


  const handleSubmit = (values: ArticleFormValues) => {
    onSubmit(values);

    toast({
      title: `Article ${initialData ? 'updated' : 'added'}!`,
      description: `"${values.title}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });

    onSuccess?.();
    if (!initialData) {
      formMethods.reset(defaultFormValues);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormField
            control={formMethods.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="The Rise of Science Fiction" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={formMethods.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ImageUpload name="coverImage" label="Cover Image" currentValue={initialData?.coverImage} folder="articles" />

          <FormField
            control={formMethods.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A short summary of the article..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formMethods.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (HTML allowed)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="<p>Start writing your article here...</p>"
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit">
              {initialData ? 'Update Article' : 'Add Article'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
