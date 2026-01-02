"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect } from 'react';

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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Book, Category, Tag, Author } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Trash2, Book as BookIcon, Mic, FileText, X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  authors: z.string().min(1, { message: "Author name is required." }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category." }),
  coverImage: z.string().optional(),
  purchaseUrls: z.object({
    paperback: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    audiobook: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    ebook: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  }).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

type BookFormValues = z.infer<typeof formSchema>;

interface BookFormProps {
  initialData?: Book | null;
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  onSubmit: (data: any) => void; // Made more flexible
  onSuccess?: () => void;
}

export function BookForm({ initialData, categories, tags: allTags, authors, onSubmit, onSuccess }: BookFormProps) {
  const { toast } = useToast();

  // Helper to get the category name from the Category object
  const getCategoryName = (category: Category | undefined): string => category?.name || "";

  const form = useForm<BookFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      authors: initialData?.authors?.map(author => author.name).join(", ") || "",
      description: initialData?.description || "",
      category: getCategoryName(initialData?.category),
      coverImage: initialData?.coverImage || "",
      purchaseUrls: initialData?.purchase_urls || { paperback: "", audiobook: "", ebook: "" },
      tags: initialData?.tags || [],
      featured: initialData?.featured || false,
    },
  });

  const selectedCategoryName = form.watch("category");
  const selectedCategory = categories.find(c => c.name === selectedCategoryName);
  const tagsForCategory = selectedCategory
    ? allTags.filter(tag => tag.category_id === selectedCategory.id)
    : [];

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        authors: initialData.authors?.map(author => author.name).join(", "),
        description: initialData.description,
        category: getCategoryName(initialData.category),
        coverImage: initialData.coverImage,
        purchaseUrls: initialData.purchase_urls,
        tags: initialData.tags,
        featured: initialData.featured,
      });
    }
  }, [initialData, form.reset]);

  const handleSubmit = (values: BookFormValues) => {
    const processedValues = {
      ...values,
    };
    onSubmit(processedValues);
    toast({
      title: `Book ${initialData ? 'updated' : 'added'}!`,
      description: `"${values.title}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <FormField name="title" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input placeholder="The Great Gatsby" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="authors" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Author(s)</FormLabel>
            <div className="flex gap-2">
              <div className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Type author name or select from dropdown"
                    {...field}
                  />
                </FormControl>
              </div>
              <Select onValueChange={(value) => {
                const selectedAuthor = authors.find(a => a.id.toString() === value);
                if (selectedAuthor) {
                  const currentAuthors = field.value ? field.value.split(',').map(a => a.trim()).filter(a => a) : [];
                  if (!currentAuthors.includes(selectedAuthor.name)) {
                    const newAuthors = [...currentAuthors, selectedAuthor.name];
                    field.onChange(newAuthors.join(', '));
                  }
                }
              }}>
                <SelectTrigger className="w-auto pr-2">
                  <SelectValue placeholder="Select existing author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id.toString()}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormDescription>
              Type author names manually and/or click the dropdown to select existing authors. Separate multiple authors with a comma.
            </FormDescription>
            {field.value && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {field.value.split(',').map((author: string, index: number) => (
                    author.trim() && (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {author.trim()}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-secondary-foreground/10"
                          onClick={() => {
                            const currentAuthors = field.value?.split(',').map(a => a.trim()).filter(a => a);
                            const newAuthors = currentAuthors?.filter((_, i) => i !== index) || [];
                            field.onChange(newAuthors.join(', '));
                          }}
                        >
                          <X className="h-3 w-4" />
                        </Button>
                      </Badge>
                    )
                  ))}
                </div>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea placeholder="A detailed description of the book..." rows={5} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="category" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <ImageUpload name="coverImage" label="Cover Image" currentValue={form.watch('coverImage')} />

        <FormField name="featured" control={form.control} render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>Featured Book</FormLabel>
                    <FormDescription>
                        Featured books will be displayed prominently on the homepage.
                    </FormDescription>
                </div>
            </FormItem>
        )} />

        <Separator />
        <FormField name="tags" render={() => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border rounded-md">
              {tagsForCategory.map((tag) => (
                <FormField key={tag.id} name="tags" control={form.control} render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(tag.name)}
                        onCheckedChange={(checked) => {
                          const newValue = field.value ? [...field.value] : [];
                          if (checked) {
                            newValue.push(tag.name);
                          } else {
                            const index = newValue.indexOf(tag.name);
                            if (index > -1) newValue.splice(index, 1);
                          }
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{tag.name}</FormLabel>
                  </FormItem>
                )} />
              ))}
            </div>
            {selectedCategoryName && tagsForCategory.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">No tags found for the selected category.</p>
            )}
            <FormMessage />
          </FormItem>
        )} />

        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Purchase Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="purchaseUrls.paperback" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><BookIcon className="w-4 h-4" /> Paperback URL</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="purchaseUrls.ebook" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><FileText className="w-4 h-4" /> E-book URL</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="purchaseUrls.audiobook" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Mic className="w-4 h-4" /> Audiobook URL</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">{initialData ? 'Update Book' : 'Add Book'}</Button>
        </div>
      </form>
    </Form>
  );
}
