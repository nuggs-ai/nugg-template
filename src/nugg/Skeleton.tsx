import { Skeleton } from "@/components/ui/skeleton"

export function TemplateSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-2xl p-4 bg-green-400 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
			loading skeleton
			<Skeleton className="w-[468px] h-[36px]" />
			<Skeleton className="w-[468px] h-[36px]" />
		</div>
	)
}
