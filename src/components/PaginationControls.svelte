<script lang="ts">
	/**
	 * PaginationControls — prev/next pagination with "X–Y of Z" label.
	 *
	 * Displays "21–40 of 87" with Prev/Next link buttons.
	 * Automatically hides when all items fit on a single page.
	 *
	 * Re-exports:
	 *   (none — standalone component)
	 *
	 * Examples:
	 *   <PaginationControls
	 *       page={0}
	 *       totalCount={87}
	 *       pageSize={50}
	 *       onChange={(p) => (page = p)}
	 *   />
	 */
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		/** 0-indexed current page */
		page: number;
		/** Total number of matching items across all pages */
		totalCount: number;
		/** Items per page */
		pageSize: number;
		/** Called with new page number (0-indexed) */
		onChange: (page: number) => void;
	}

	let { page, totalCount, pageSize, onChange }: Props = $props();

	let totalPages = $derived(Math.max(1, Math.ceil(totalCount / pageSize)));
	let startItem = $derived(totalCount > 0 ? page * pageSize + 1 : 0);
	let endItem = $derived(Math.min((page + 1) * pageSize, totalCount));
	let hasPrev = $derived(page > 0);
	let hasNext = $derived(page < totalPages - 1);
	let show = $derived(totalCount > pageSize && totalCount > 0);
</script>

{#if show}
	<div class="Pagination" role="navigation" aria-label="Pagination">
		<span class="PageInfo">{startItem}–{endItem} of {totalCount}</span>
		<Button
			variant="link"
			size="small"
			disabled={!hasPrev}
			aria-label="Previous page"
			onclick={() => onChange(page - 1)}
		>
			<Icon size={16} strokeWidth={3}>
				<polyline points="15 18 9 12 15 6" />
			</Icon>
		</Button>
		<Button
			variant="link"
			size="small"
			disabled={!hasNext}
			aria-label="Next page"
			onclick={() => onChange(page + 1)}
		>
			<Icon size={16} strokeWidth={3}>
				<polyline points="9 18 15 12 9 6" />
			</Icon>
		</Button>
	</div>
{/if}

<style>
	.Pagination {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--black);
		white-space: nowrap;
	}

	.PageInfo {
		padding: 0 0.5em 0 0;
		user-select: none;
	}
</style>
