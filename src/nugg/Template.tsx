'use client';

import { cn } from '@/lib/utils';
import './styles.css'

export default function Counter({ initialCount = 0 }: { initialCount: number }) {
	return (
		<div
			className={cn(
				'flex flex-col gap-4 rounded-2xl p-4 w-full sm:min-w-[400px] sm:max-w-[500px] max-w-[300px] bg-green-500'
			)}
		>
			hello
		</div>
	);
}

