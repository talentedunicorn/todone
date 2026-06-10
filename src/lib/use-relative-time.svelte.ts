import { formatTime } from './format-time';

/**
 * Reactive relative-time composable for Svelte 5 runes mode.
 *
 * Call this inside a `.svelte` or `.svelte.ts` file. It returns a reactive
 * `relativeTime` string that updates every 30 seconds so "just now" / "2m ago"
 * stays fresh.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useRelativeTime } from '$lib/use-relative-time.svelte';
 *   let { task } = $props();
 *   const time = useRelativeTime(() => task.updated);
 * </script>
 *
 * <span title={formatTimestamp(task.updated)}>{time.relativeTime}</span>
 * ```
 */
export function useRelativeTime(iso: () => string | undefined | null): {
	relativeTime: string;
} {
	let tick = $state(0);

	$effect(() => {
		const interval = setInterval(() => tick++, 30_000);
		return () => clearInterval(interval);
	});

	let relativeTime = $derived.by(() => {
		// Access tick so Svelte tracks it as a dependency
		tick;
		const val = iso();
		return val ? formatTime(val) : '';
	});

	return {
		get relativeTime() {
			return relativeTime;
		}
	};
}
