
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import React from 'react';

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
import { Book, Category, Tag } from "@/lib/types";
import categories from "@/lib/categories.json";
import allTags from "@/lib/tags.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { Separator } from "../ui/separator";


const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  authors: z.string().min(1, { message: "Author name is required." }),
  category: z.string().min(1, { message: "Please select a category." }),
  coverImage: z.string().min(1, { message: "Please upload an image." }),
  review: z.string().min(20, { message: "Review must be at least 20 characters." }),
  purchaseUrls: z.object({
    paperback: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    audiobook: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    ebook: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  }),
  tags: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one tag.",
  }),
  quotes: z.string().optional(),
});

type BookFormValues = z.infer<typeof formSchema>;

const defaultFormValues = {
    title: "",
    authors: "",
    category: "",
    coverImage: "",
    review: "",
    purchaseUrls: {
        paperback: "",
        audiobook: "",
        ebook: "",
    },
    tags: [],
    quotes: "",
};

interface BookFormProps {
  initialData?: Book | null;
  onSubmit: (data: Omit<Book, 'id'> | Book) => void;
  onSuccess?: () => void;
}

export function BookForm({ initialData, onSubmit, onSuccess }: BookFormProps) {
  const { toast } = useToast();

  const formMethods = useForm<BookFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        authors: initialData.authors.join(", "),
        tags: initialData.tags || [],
        quotes: initialData.quotes?.join("\\n") || "",
        purchaseUrls: {
          paperback: initialData.purchaseUrls?.paperback || "",
          audiobook: initialData.purchaseUrls?.audiobook || "",
          ebook: initialData.purchaseUrls?.ebook || "",
        }
    } : defaultFormValues,
  });

   React.useEffect(() => {
    if (initialData) {
      formMethods.reset({
        ...initialData,
        authors: initialData.authors.join(", "),
        tags: initialData.tags || [],
        quotes: initialData.quotes?.join("\\n") || "",
        purchaseUrls: {
          paperback: initialData.purchaseUrls?.paperback || "",
          audiobook: initialData.purchaseUrls?.audiobook || "",
          ebook: initialData.purchaseUrls?.ebook || "",
        }
      });
    } else {
      formMethods.reset(defaultFormValues);
    }
  }, [initialData, formMethods]);


  const handleSubmit = (values: BookFormValues) => {
    const bookData = {
      ...values,
      quotes: values.quotes?.split("\\n").map(q => q.trim()).filter(q => q) || [],
    };
    
    // @ts-ignore
    onSubmit(bookData);

    toast({
      title: `Book ${initialData ? 'updated' : 'added'}!`,
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
                  <Input placeholder="The Great Gatsby" {...field} />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
        />

        <FormField
            control={formMethods.control}
            name="authors"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Author(s)</FormLabel>
                <FormControl>
                <Input placeholder="F. Scott Fitzgerald" {...field} />
                </FormControl>
                <FormDescription>
                Separate multiple authors with a comma. New authors will be created automatically.
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
          control={formMethods.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(categories as Category[]).map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <ImageUpload name="coverImage" label="Cover Image" currentValue={initialData?.coverImage} />

        <FormField
          control={formMethods.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A detailed review of the book..."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
         <FormField
            control={formMethods.control}
            name="tags"
            render={() => (
                <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base">Tags</FormLabel>
                    <FormDescription>
                    Select the tags that best fit this book.
                    </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                    {(allTags as Tag[]).map((tag) => (
                    <FormField
                        key={tag.id}
                        control={formMethods.control}
                        name="tags"
                        render={({ field }) => {
                        return (
                            <FormItem
                            key={tag.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                            >
                            <FormControl>
                                <Checkbox
                                checked={field.value?.includes(tag.name)}
                                onCheckedChange={(checked) => {
                                    return checked
                                    ? field.onChange([...(field.value || []), tag.name])
                                    : field.onChange(
                                        field.value?.filter(
                                            (value) => value !== tag.name
                                        )
                                        )
                                }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {tag.name}
                            </FormLabel>
                            </FormItem>
                        )
                        }}
                    />
                    ))}
                </div>
                <FormMessage />
                </FormItem>
            )}
            />
        <Separator />
         <FormField
          control={formMethods.control}
          name="quotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quotes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`"It was the best of times..."\\n"Call me Ishmael."`}
                  rows={4}
                  {...field}
                />
              </FormControl>
               <FormDescription>
                Enter one quote per line.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
         <div className="space-y-4">
            <h3 className="text-lg font-medium">Purchase Links</h3>
            <FormDescription>
              Enter the full URLs for any available formats. Leave blank if not applicable.
            </FormDescription>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={formMethods.control}
                    name="purchaseUrls.paperback"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Paperback URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/buy-paperback" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={formMethods.control}
                    name="purchaseUrls.ebook"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>E-book URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/buy-ebook" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={formMethods.control}
                    name="purchaseUrls.audiobook"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Audiobook URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/buy-audiobook" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
        </div>

        <div className="flex justify-end pt-4">
            <Button type="submit">
                {initialData ? 'Update Book' : 'Add Book'}
            </Button>
        </div>
      </form>
    </Form>
    </FormProvider>
  );
}
