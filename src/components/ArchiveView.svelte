<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Todo } from '../domain/todo';
	import { expandedTasks } from '../stores';
	import MarkdownContent from './MarkdownContent.svelte';

	interface Props {
		data: Todo[];
	}

	let { data }: Props = $props();

	let archivedTasks = $derived(data.filter((t) => t.status === 'archived'));

	const handleToggleExpand = (id: string) => {
		expandedTasks.update((set) => {
			const next = new Set(set);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};
</script>

<div class="archive">
	{#if archivedTasks.length > 0}
		{#each archivedTasks as task (task.id)}
			{@const { id, title, value } = task}
			<article
				class="archive-item"
				role="button"
				tabindex="0"
				onclick={() => handleToggleExpand(id)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleToggleExpand(id);
					}
				}}
			>
				<div class="archive-title">{title}</div>
				{#if $expandedTasks.has(id) && value}
					<div class="archive-body" transition:slide={{ duration: 150 }}>
						<MarkdownContent {value} />
					</div>
				{/if}
			</article>
		{/each}
	{:else}
		<p class="empty">No archived tasks.</p>
	{/if}
</div>

<style>
	.archive {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.archive-item {
		background: var(--white);
		border: 1px solid var(--gray-light);
		border-radius: 0.75rem;
		padding: 1rem;
		opacity: 0.7;
		cursor: pointer;
	}

	.archive-title {
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--black);
	}

	.archive-body {
		font-size: 0.85rem;
		color: var(--black);
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--gray-light);
		overflow: hidden;
		white-space: pre-wrap;
	}

	.empty {
		font-size: 0.9rem;
		color: var(--gray);
		text-align: center;
		padding: 2rem;
	}
</style>
