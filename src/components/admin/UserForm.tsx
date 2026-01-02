
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
    }, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: any) => void;
  onSuccess?: () => void;
}

export function UserForm({ initialData, onSubmit, onSuccess }: UserFormProps) {
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        username: initialData?.username || "",
        email: initialData?.email || "",
        password: "",
        confirmPassword: ""
    },
  });

  React.useEffect(() => {
    form.reset({
        username: initialData?.username || "",
        email: initialData?.email || "",
        password: "",
        confirmPassword: ""
    });
  }, [initialData, form]);


  const handleSubmit = (values: UserFormValues) => {
    if (!initialData && !values.password) {
        form.setError("password", { message: "Password is required for new users." });
        return;
    }

    // Add role and is_active to match User type
    const userData = {
      ...values,
      role: "Admin",
      is_active: true
    };

    onSubmit(userData);

    toast({
      title: `User ${initialData ? 'updated' : 'added'}!`,
      description: `"${values.username}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });
    
    onSuccess?.();
    if (!initialData) {
        form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder={initialData ? "Leave blank to keep current password" : "Set a password"} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm new password" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit">
                {initialData ? 'Update User' : 'Add User'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
