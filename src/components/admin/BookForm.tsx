
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
import { Book, Category, Tag, Author } from "@/lib/types";
import { categoryService, tagService, authorService } from "@/lib/services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImageUpload } from "./ImageUpload";
import { Separator } from "../ui/separator";
import { ChevronsUpDown, Search, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFieldArray } from "react-hook-form";


const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters." }).regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  authors: z.array(z.string()).min(1, { message: "Select at least one author." }),
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
  faq: z.array(z.object({
    question: z.string().min(5, "Question is too short"),
    answer: z.string().min(5, "Answer is too short"),
  })).optional(),
});

type BookFormValues = z.infer<typeof formSchema>;

const defaultFormValues = {
  title: "",
  slug: "",
  authors: [],
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
  faq: [],
};

interface BookFormProps {
  initialData?: Book | null;
  onSubmit: (data: Omit<Book, 'id'> | Book) => void;
  onSuccess?: () => void;
}

export function BookForm({ initialData, onSubmit, onSuccess }: BookFormProps) {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [allTags, setAllTags] = React.useState<Tag[]>([]);
  const [allAuthors, setAllAuthors] = React.useState<Author[]>([]);
  const [authorSearch, setAuthorSearch] = React.useState("");
  const [isAuthorOpen, setAuthorOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, tags, authors] = await Promise.all([
          categoryService.getAll(),
          tagService.getAll(),
          authorService.getAll()
        ]);
        setCategories(cats);
        setAllTags(tags);
        setAllAuthors(authors);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
        toast({
          title: "Error",
          description: "Failed to load categories, tags, or authors.",
          variant: "destructive"
        });
      }
    };
    fetchMetadata();
  }, [toast]);

  const formMethods = useForm<BookFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      authors: Array.isArray(initialData.authors) ? initialData.authors : [],
      tags: initialData.tags || [],
      quotes: initialData.quotes?.join("\n") || "",
      faq: initialData.faq || [],
      purchaseUrls: {
        paperback: initialData.purchaseUrls?.paperback || "",
        audiobook: initialData.purchaseUrls?.audiobook || "",
        ebook: initialData.purchaseUrls?.ebook || "",
      }
    } : defaultFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: "faq",
  });

  React.useEffect(() => {
    if (initialData) {
      formMethods.reset({
        ...initialData,
        authors: Array.isArray(initialData.authors) ? initialData.authors : [],
        tags: initialData.tags || [],
        quotes: initialData.quotes?.join("\n") || "",
        faq: initialData.faq || [],
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

  const watchedTitle = formMethods.watch("title");
  React.useEffect(() => {
    if (!initialData && watchedTitle) {
      const currentSlug = formMethods.getValues("slug");
      if (!currentSlug || currentSlug === watchedTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').slice(0, -1)) {
        formMethods.setValue("slug", watchedTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), { shouldValidate: true });
      }
    }
  }, [watchedTitle, initialData, formMethods]);


  const handleSubmit = (values: BookFormValues) => {
    const bookData = {
      ...values,
      quotes: values.quotes?.split("\n").map(q => q.trim()).filter(q => q) || [],
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <Input placeholder="the-great-gatsby" {...field} />
                </FormControl>
                <FormDescription>
                  The unique URL for this book (e.g., libribooks.com/book/<strong>the-great-gatsby</strong>).
                </FormDescription>
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
                <div className="flex flex-col gap-2">
                  <Popover open={isAuthorOpen} onOpenChange={setAuthorOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isAuthorOpen}
                          className="w-full justify-between"
                        >
                          {field.value?.length > 0
                            ? `${field.value.length} authors selected`
                            : "Select authors..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <div className="p-2 border-b">
                        <div className="flex items-center px-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search authors..."
                            value={authorSearch}
                            onChange={(e) => setAuthorSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      <ScrollArea className="h-[200px] p-2">
                        {allAuthors.filter(author =>
                          author.name.toLowerCase().includes(authorSearch.toLowerCase())
                        ).length === 0 ? (
                          <p className="text-sm text-center text-muted-foreground py-4">No authors found.</p>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {allAuthors.filter(author =>
                              author.name.toLowerCase().includes(authorSearch.toLowerCase())
                            ).map((author) => (
                              <div key={author.id} className="flex items-center space-x-2 p-2 rounded-sm hover:bg-accent cursor-pointer" onClick={() => {
                                const current = field.value || [];
                                const isSelected = current.includes(author.name);
                                if (isSelected) {
                                  field.onChange(current.filter((n: string) => n !== author.name));
                                } else {
                                  field.onChange([...current, author.name]);
                                }
                              }}>
                                <Checkbox
                                  id={`author-${author.id}`}
                                  checked={field.value?.includes(author.name)}
                                  onCheckedChange={() => { }} // Handled by div click
                                />
                                <label
                                  htmlFor={`author-${author.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pointer-events-none"
                                >
                                  {author.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  {field.value?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {field.value.map((authorName: string) => (
                        <div key={authorName} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                          {authorName}
                          <span className="cursor-pointer ml-1 text-muted-foreground hover:text-foreground" onClick={() => {
                            field.onChange(field.value.filter((n: string) => n !== authorName));
                          }}>×</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <FormDescription>
                  Select existing authors from the database.
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
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
                  {allTags.map((tag) => (
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
                    placeholder={`"It was the best of times..."\n"Call me Ishmael."`}
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

          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Book FAQ</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ question: "", answer: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </div>
            <FormDescription>
              Add common questions and answers about this book for readers.
            </FormDescription>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-md relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <FormField
                    control={formMethods.control}
                    name={`faq.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="What is the main theme of this book?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formMethods.control}
                    name={`faq.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="The main theme is..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {fields.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-4 bg-muted/50 rounded-md border border-dashed">
                  No FAQs added yet.
                </p>
              )}
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
