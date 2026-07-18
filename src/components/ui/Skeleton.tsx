import { type ReactNode } from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-3xl glass p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-28" />
        </div>
        <Skeleton className="h-10 w-10 rounded-2xl" />
      </div>
      <Skeleton className="mt-4 h-3 w-24" />
    </div>
  );
}

export function SkeletonRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl glass p-3 ${className}`}>
      <Skeleton className="h-9 w-9 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="mt-1.5 h-2.5 w-28" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

export function PageSkeleton({ children }: { children?: ReactNode }) {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-2xl" />
        <div>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-1.5 h-3 w-56" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
      {children}
    </div>
  );
}
