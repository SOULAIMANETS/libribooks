
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
import { Author } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  image: z.string().min(1, { message: "Please upload an image." }),
  bio: z.string().min(20, { message: "Bio must be at least 20 characters." }),
});

type AuthorFormValues = z.infer<typeof formSchema>;

interface AuthorFormProps {
  initialData?: Author | null;
  onSubmit: (data: Omit<Author, 'id'> | Author) => void;
  onSuccess?: () => void;
}

export function AuthorForm({ initialData, onSubmit, onSuccess }: AuthorFormProps) {
  const { toast } = useToast();

  const formMethods = useForm<AuthorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      image: "",
      bio: "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      formMethods.reset(initialData);
    } else {
      formMethods.reset({
        name: "",
        image: "",
        bio: "",
      });
    }
  }, [initialData, formMethods.reset]);


  const handleSubmit = (values: AuthorFormValues) => {
    onSubmit(values);

    toast({
      title: `Author ${initialData ? 'updated' : 'added'}!`,
      description: `"${values.name}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });

    onSuccess?.();
    if (!initialData) {
      formMethods.reset();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <FormField
            control={formMethods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="J.K. Rowling" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ImageUpload name="image" label="Author Image" currentValue={initialData?.image} folder="authors" />

          <FormField
            control={formMethods.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A short biography of the author..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit">
              {initialData ? 'Update Author' : 'Add Author'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
