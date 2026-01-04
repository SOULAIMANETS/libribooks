
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

interface ImageUploadProps {
  name: string;
  label: string;
  currentValue?: string | null;
}

export function ImageUpload({ name, label, currentValue }: ImageUploadProps) {
  const { setValue, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(currentValue || null);
  const watchedValue = watch(name);

  useEffect(() => {
    if (watchedValue && watchedValue.startsWith('data:image')) {
      setPreview(watchedValue);
    } else if (currentValue) {
      setPreview(currentValue);
    } else {
      setPreview(null);
    }
  }, [watchedValue, currentValue]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue(name, base64String, { shouldValidate: true, shouldDirty: true });
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setValue(name, '', { shouldValidate: true, shouldDirty: true });
    setPreview(null);
  };

  return (
    <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
        <div
            {...getRootProps()}
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'}
            ${preview ? 'p-0 border-solid' : ''}`}
        >
            <input {...getInputProps()} />
            {preview ? (
            <div className="relative aspect-video w-full">
                <Image src={preview} alt="Image preview" fill objectFit="contain" />
                <button
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
    </div>
  );
}
