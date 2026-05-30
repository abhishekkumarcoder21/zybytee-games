import { Skeleton } from '@/components/ui/skeleton';

export default function GameLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <Skeleton className="aspect-[16/10] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
