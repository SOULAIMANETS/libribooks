import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

interface LoadingSkeletonProps {
  type?: 'form' | 'card' | 'list';
  lines?: number;
}

export function LoadingSkeleton({ type = 'form', lines = 3 }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  // Default form type
  return (
    <div className="space-y-8">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton };
