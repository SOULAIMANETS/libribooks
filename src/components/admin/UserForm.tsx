"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(["Admin", "Editor"]),
  password: z.string().optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: UserFormValues) => void;
  onSuccess?: () => void;
}

export function UserForm({ initialData, onSubmit, onSuccess }: UserFormProps) {
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      role: "Editor",
      password: "",
    },
  });

  const handleSubmit = (values: UserFormValues) => {
    // Basic client-side validation for password on create
    if (!initialData && !values.password) {
      form.setError("password", { message: "Password is required for new users" });
      return;
    }
    onSubmit(values);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="john@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Only show password field for new users or if we want to allow password updates (which is complex with Supabase Auth admin API, usually separate flow) 
            For now, let's only allow setting it on creation.
        */}
        {!initialData && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                </SelectContent>
              </Select>
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
