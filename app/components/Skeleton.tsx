'use client';

import React from 'react';

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Reusable shimmering skeleton placeholder.
 * Add sizing/shape via Tailwind classes (e.g. `w-8 h-8 rounded-full`).
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-testid="skeleton"
      className={`oro-skeleton ${className ?? ''}`}
      style={style}
    />
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={`h-4 rounded-md w-full ${className ?? ''}`} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return <Skeleton className={`h-32 rounded-2xl w-full ${className ?? ''}`} />;
}

export function SkeletonCircle({ className }: { className?: string }) {
  return <Skeleton className={`w-10 h-10 rounded-full ${className ?? ''}`} />;
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={`h-11 rounded-full w-32 ${className ?? ''}`} />;
}

export function SkeletonRow({ className }: { className?: string }) {
  return <Skeleton className={`h-14 rounded-xl w-full ${className ?? ''}`} />;
}

export default Skeleton;
