import { Skeleton } from "@/components/ui/skeleton"

export function MessageSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-2 w-[100px]" />
                <Skeleton className="h-2 w-[150px]" />
            </div>
        </div>
    );
}
