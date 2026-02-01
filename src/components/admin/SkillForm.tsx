"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { Skill } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters." }).regex(/^[a-z0-9-]+$/, { message: "Slug must be lowercase with hyphens only." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    pillarContent: z.string().optional(),
    coverImage: z.string().optional(),
    icon: z.string().optional(),
});

type SkillFormValues = z.infer<typeof formSchema>;

const defaultFormValues: SkillFormValues = {
    name: "",
    slug: "",
    description: "",
    pillarContent: "",
    coverImage: "",
    icon: "",
};

interface SkillFormProps {
    initialData?: Skill | null;
    onSubmit: (data: Omit<Skill, 'id'>) => void;
    onSuccess?: () => void;
}

export function SkillForm({ initialData, onSubmit, onSuccess }: SkillFormProps) {
    const { toast } = useToast();

    const formMethods = useForm<SkillFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description,
            pillarContent: initialData.pillarContent || "",
            coverImage: initialData.coverImage || "",
            icon: initialData.icon || "",
        } : defaultFormValues,
    });

    React.useEffect(() => {
        if (initialData) {
            formMethods.reset({
                name: initialData.name,
                slug: initialData.slug,
                description: initialData.description,
                pillarContent: initialData.pillarContent || "",
                coverImage: initialData.coverImage || "",
                icon: initialData.icon || "",
            });
        } else {
            formMethods.reset(defaultFormValues);
        }
    }, [initialData, formMethods]);

    // Auto-generate slug from name
    const watchName = formMethods.watch("name");
    React.useEffect(() => {
        if (!initialData && watchName) {
            const slug = watchName
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            formMethods.setValue("slug", slug);
        }
    }, [watchName, initialData, formMethods]);

    const handleSubmit = (values: SkillFormValues) => {
        onSubmit(values as Omit<Skill, 'id'>);

        toast({
            title: `Skill ${initialData ? 'updated' : 'added'}!`,
            description: `"${values.name}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
        });

        onSuccess?.();
        if (!initialData) {
            formMethods.reset(defaultFormValues);
        }
    };

    return (
        <FormProvider {...formMethods}>
            <Form {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={formMethods.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Productivity" {...field} />
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
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="productivity" {...field} disabled={!!initialData} />
                                    </FormControl>
                                    <FormDescription>
                                        URL-friendly identifier (auto-generated)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={formMethods.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon (Emoji)</FormLabel>
                                <FormControl>
                                    <Input placeholder="🎯" {...field} className="w-24 text-2xl" />
                                </FormControl>
                                <FormDescription>
                                    Use an emoji as the skill icon
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={formMethods.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="A short description of this skill..."
                                        rows={2}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Short description shown on the Skills Hub page
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ImageUpload name="coverImage" label="Cover Image" currentValue={initialData?.coverImage} folder="skills" />

                    <FormField
                        control={formMethods.control}
                        name="pillarContent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pillar Content (HTML)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="<h2>What is Productivity?</h2><p>Productivity is...</p>"
                                        rows={12}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The comprehensive guide content (~3000 words). HTML is allowed.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-4">
                        <Button type="submit">
                            {initialData ? 'Update Skill' : 'Add Skill'}
                        </Button>
                    </div>
                </form>
            </Form>
        </FormProvider>
    );
}
