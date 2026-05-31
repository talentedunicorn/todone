<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Todo, TaskStatus } from '../domain/todo';
	import KanbanCard from './KanbanCard.svelte';

	interface Props {
		title: string;
		status: TaskStatus;
		tasks: Todo[];
		collapsed: boolean;
		onToggleCollapse: () => void;
		expandedTasks: Set<string>;
		onToggleExpand: (id: string, expanded: boolean) => void;
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange: (id: string, status: TaskStatus) => void;
		ondrop?: (e: DragEvent) => void;
		ondragover?: (e: DragEvent) => void;
	}

	let {
		title,
		status: _status,
		tasks,
		collapsed,
		onToggleCollapse,
		expandedTasks,
		onToggleExpand,
		onEdit,
		onDelete,
		onStatusChange,
		ondrop,
		ondragover
	}: Props = $props();
</script>

<div class="column" class:collapsed role="region" aria-label={title} {ondrop} {ondragover}>
	<div
		class="column-header"
		onclick={onToggleCollapse}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onToggleCollapse();
			}
		}}
		role="button"
		tabindex="0"
	>
		<h3 class="column-title">{title}</h3>
		<span class="count">{tasks.length}</span>
		<svg
			class="collapse-icon"
			class:collapsed
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</div>
	{#if !collapsed}
		<div class="column-body" transition:slide={{ duration: 150 }}>
			{#each tasks as task (task.id)}
				<KanbanCard
					{task}
					expanded={expandedTasks.has(task.id)}
					{onToggleExpand}
					{onEdit}
					{onDelete}
					{onStatusChange}
				/>
			{/each}
			{#if tasks.length === 0}
				<p class="empty">No tasks</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.column {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--gray-bg);
		border-radius: 0.75rem;
		padding: 1rem;
		min-height: auto;
	}

	.column.collapsed {
		min-height: auto;
	}

	.column-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--gray-light);
		cursor: pointer;
		user-select: none;
	}

	.column-header:hover {
		opacity: 0.8;
	}

	.column-title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		color: var(--text, #111827);
		flex: 1;
	}

	.count {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--gray, #6b7280);
		background: var(--gray-light);
		padding: 0.1em 0.5em;
		border-radius: 999px;
	}

	.collapse-icon {
		color: var(--gray, #6b7280);
		transition: transform 0.15s;
		transform-origin: center;
	}

	.collapse-icon.collapsed {
		transform: rotate(-90deg);
	}

	.column-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		overflow: hidden;
	}

	.empty {
		font-size: 0.85rem;
		color: var(--gray, #9ca3af);
		text-align: center;
		padding: 1rem;
	}
</style>
