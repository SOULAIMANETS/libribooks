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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Article, Author } from "@/lib/types"; // Import Author type
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author_id: z.coerce.number().min(1, { message: "Please select an author." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  coverImage: z.string().min(1, { message: "Please upload an image." }),
  excerpt: z.string().min(20, { message: "Excerpt must be at least 20 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
});

export type ArticleFormValues = z.infer<typeof formSchema>;

const defaultFormValues = (authors: Author[]) => ({
    title: "",
    author_id: authors[0]?.id || 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    coverImage: "",
    excerpt: "",
    content: "",
});


interface ArticleFormProps {
  initialData?: Article | null;
  authors: Author[];
  onSubmit: (data: ArticleFormValues) => void;
  onSuccess?: () => void;
}

export function ArticleForm({ initialData, authors, onSubmit, onSuccess }: ArticleFormProps) {
  const { toast } = useToast();

  // Helper to format date, handling potential undefined initialData.date
  const formatDateForForm = (dateString: string | undefined): string => {
    if (dateString && !isNaN(Date.parse(dateString))) {
      return format(new Date(dateString), 'yyyy-MM-dd');
    }
    return format(new Date(), 'yyyy-MM-dd'); // Default to today if date is invalid or missing
  };

  const formMethods = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: formatDateForForm(initialData.date),
          // Ensure coverImage is handled if it's missing in initialData
          coverImage: initialData.coverImage || "",
        }
      : defaultFormValues(authors),
  });

   React.useEffect(() => {
    if (initialData) {
      formMethods.reset({
        ...initialData,
        date: formatDateForForm(initialData.date),
        // Ensure coverImage is handled if it's missing in initialData
        coverImage: initialData.coverImage || "",
      });
    } else {
       formMethods.reset(defaultFormValues(authors));
    }
  }, [initialData, authors, formMethods]);


  const handleSubmit = (values: ArticleFormValues) => {
    onSubmit(values);

    toast({
      title: `Article ${initialData ? 'updated' : 'added'}!`,
      description: `"${values.title}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });
    
    onSuccess?.();
    if (!initialData) {
        formMethods.reset(defaultFormValues(authors));
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
              name="author_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an author" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={String(author.id)}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
        
        <ImageUpload name="coverImage" label="Cover Image" currentValue={initialData?.coverImage} />

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
