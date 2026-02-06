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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Article, Skill } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";
import { skillService } from "@/lib/services";
import { AutoLinkManager } from "./AutoLinkManager";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  coverImage: z.string().min(1, { message: "Please upload an image." }),
  excerpt: z.string().min(20, { message: "Excerpt must be at least 20 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  skillSlug: z.string().optional(),
  articleRole: z.string().optional(),
  keywordLinks: z.array(z.object({
    keyword: z.string(),
    url: z.string()
  })).optional().default([]),
});

type ArticleFormValues = z.infer<typeof formSchema>;

const defaultFormValues: ArticleFormValues = {
  title: "",
  author: "Admin",
  date: format(new Date(), 'yyyy-MM-dd'),
  coverImage: "",
  excerpt: "",
  content: "",
  skillSlug: "",
  articleRole: "pillar-support",
  keywordLinks: [],
};

const ARTICLE_ROLES = [
  { value: 'pillar-support', label: 'Pillar Support' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'concept', label: 'Concept' },
  { value: 'book-focused', label: 'Book Focused' },
];

interface ArticleFormProps {
  initialData?: Article | null;
  onSubmit: (data: Omit<Article, 'slug'> | Article) => void;
  onSuccess?: () => void;
}

export function ArticleForm({ initialData, onSubmit, onSuccess }: ArticleFormProps) {
  const { toast } = useToast();
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = React.useState(true);

  // Fetch skills on mount
  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillService.getAll();
        // Filter out skills that don't have a slug to prevent key errors or select issues
        setSkills(data.filter(s => s.slug && s.slug.trim() !== ''));
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  const formMethods = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      author: initialData.author,
      date: format(new Date(initialData.date), 'yyyy-MM-dd'),
      coverImage: initialData.coverImage,
      excerpt: initialData.excerpt,
      content: initialData.content,
      skillSlug: initialData.skillSlug || "",
      articleRole: initialData.articleRole || "pillar-support",
      keywordLinks: initialData.keywordLinks || [],
    } : defaultFormValues,
  });

  React.useEffect(() => {
    if (initialData) {
      formMethods.reset({
        title: initialData.title,
        author: initialData.author,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        coverImage: initialData.coverImage,
        excerpt: initialData.excerpt,
        content: initialData.content,
        skillSlug: initialData.skillSlug || "",
        articleRole: initialData.articleRole || "pillar-support",
        keywordLinks: initialData.keywordLinks || [],
      });
    } else {
      formMethods.reset(defaultFormValues);
    }
  }, [initialData, formMethods]);

  const handleSubmit = (values: ArticleFormValues) => {
    const submitData = {
      ...values,
      skillSlug: values.skillSlug || undefined,
      articleRole: values.articleRole as Article['articleRole'] || undefined,
    };
    onSubmit(submitData);

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

          {/* Skill & Role Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
            <FormField
              control={formMethods.control}
              name="skillSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingSkills ? "Loading..." : "Select a skill"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {skills.map((skill) => (
                        <SelectItem key={skill.slug} value={skill.slug}>
                          {skill.icon && `${skill.icon} `}{skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Assign this article to a skill for better SEO.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="articleRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ARTICLE_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Content type for SEO classification.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ImageUpload name="coverImage" label="Cover Image" currentValue={initialData?.coverImage} folder="articles" />

          {/* AutoLink Manager */}
          <FormField
            control={formMethods.control}
            name="keywordLinks"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AutoLinkManager
                    initialLinks={field.value}
                    onChange={(links) => field.onChange(links)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
