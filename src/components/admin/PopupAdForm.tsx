
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
import { useToast } from "@/hooks/use-toast";
import { PopupAd } from "@/lib/types";
import { Switch } from "../ui/switch";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  content: z.string().min(10, { message: "HTML content is required." }),
  displayDelay: z.coerce.number().min(0, { message: "Delay must be a positive number." }),
  displayDuration: z.coerce.number().min(1, { message: "Duration must be at least 1 second." }),
  isActive: z.boolean().default(false),
});

type PopupAdFormValues = z.infer<typeof formSchema>;

const defaultFormValues = {
    name: "",
    content: "<div>Your HTML content here</div>",
    displayDelay: 5,
    displayDuration: 15,
    isActive: false,
};

interface PopupAdFormProps {
  initialData?: PopupAd | null;
  onSubmit: (data: Omit<PopupAd, 'id'> | PopupAd) => void;
  onSuccess?: () => void;
}

export function PopupAdForm({ initialData, onSubmit, onSuccess }: PopupAdFormProps) {
  const { toast } = useToast();

  const formMethods = useForm<PopupAdFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultFormValues,
  });

   React.useEffect(() => {
    if (initialData) {
      formMethods.reset(initialData);
    } else {
      formMethods.reset(defaultFormValues);
    }
  }, [initialData, formMethods]);


  const handleSubmit = (values: PopupAdFormValues) => {
    onSubmit(values);

    toast({
      title: `Popup ${initialData ? 'updated' : 'added'}!`,
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
      <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        
        <FormField
          control={formMethods.control}
          name="name"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Popup Name</FormLabel>
              <FormControl>
                  <Input placeholder="e.g., Summer Sale" {...field} />
              </FormControl>
              <FormDescription>This name is for internal identification only.</FormDescription>
              <FormMessage />
              </FormItem>
          )}
        />
        
        <FormField
          control={formMethods.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (HTML)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="<div>Your HTML code here...</div>"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={formMethods.control}
            name="displayDelay"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Display Delay (seconds)</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Time before popup appears.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={formMethods.control}
            name="displayDuration"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Display Duration (seconds)</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                 <FormDescription>Time popup stays visible.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={formMethods.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Activate Popup
                </FormLabel>
                <FormDescription>
                  Enable this popup on the site. Only one popup can be active at a time.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
            <Button type="submit">
                {initialData ? 'Update Popup' : 'Add Popup'}
            </Button>
        </div>
      </form>
    </Form>
    </FormProvider>
  );
}
