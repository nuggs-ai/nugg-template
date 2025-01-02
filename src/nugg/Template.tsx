'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TemplateSkeleton } from './Skeleton';
import './styles.css'

export default function Counter({ initialCount = 0 }: { initialCount: number }) {
	const [count, setCount] = useState<number>(initialCount);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		function delayOneSecond() {
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}

		delayOneSecond();
	}, []);

	if (loading) {
		return <TemplateSkeleton />;
	}

	return (
		<div
			className={cn(
				'flex flex-col gap-4 rounded-2xl p-4 w-full sm:min-w-[400px] sm:max-w-[500px] max-w-[300px] bg-green-500'
			)}
		>
			Count is {count}
			<Button onClick={() => setCount(count + 1)}>increment</Button>
			<Button onClick={() => setCount(count - 1)}>decrement</Button>
		</div>
	);
}
