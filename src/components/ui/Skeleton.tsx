import { cn } from '@/lib/cn';

export function Skeleton({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/60', className)}
      {...props}
    />
  );
}

