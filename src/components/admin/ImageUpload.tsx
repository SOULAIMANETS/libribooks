"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  name: string;
  label: string;
  currentValue?: string | null;
  bucket?: string;
  folder?: string;
}

export function ImageUpload({ name, label, currentValue, bucket = 'libribooks', folder = 'books' }: ImageUploadProps) {
  const { setValue, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(currentValue || null);
  const [isUploading, setIsUploading] = useState(false);
  const watchedValue = watch(name);

  useEffect(() => {
    if (watchedValue) {
      setPreview(watchedValue);
    } else if (currentValue) {
      setPreview(currentValue);
    } else {
      setPreview(null);
    }
  }, [watchedValue, currentValue]);

  // ... (lines 34-73 unchanged)

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setValue(name, '', { shouldValidate: true, shouldDirty: true });
    setPreview(null); // Explicitly clear preview
  };

  return (
    <div>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
      <div
        {...getRootProps()}
        className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'}
            ${preview ? 'p-0 border-solid overflow-hidden' : ''}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="relative aspect-video w-full">
            <Image src={preview} alt="Image preview" fill className="object-contain" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full p-1 text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <UploadCloud className="h-8 w-8" />
            <p className="font-semibold">
              {isDragActive ? 'Drop the files here...' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
      {!preview && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1 text-center">- OR -</p>
          <input
            type="text"
            placeholder="Enter image URL manually..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              const url = e.target.value;
              if (url) {
                setValue(name, url, { shouldValidate: true, shouldDirty: true });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
