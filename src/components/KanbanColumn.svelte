<script lang="ts">
	import type { Todo, TaskStatus } from '../domain/todo';
	import KanbanCard from './KanbanCard.svelte';

	interface Props {
		title: string;
		status: TaskStatus;
		tasks: Todo[];
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
		expandedTasks,
		onToggleExpand,
		onEdit,
		onDelete,
		onStatusChange,
		ondrop,
		ondragover
	}: Props = $props();
</script>

<div class="column" role="region" aria-label={title} {ondrop} {ondragover}>
	<div class="column-header">
		<h3 class="column-title">{title}</h3>
		<span class="count">{tasks.length}</span>
	</div>
	<div class="column-body">
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
</div>

<style>
	.column {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--gray-bg, #f3f4f6);
		border-radius: 0.75rem;
		padding: 1rem;
		min-height: 200px;
	}

	.column-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--gray-light, #e5e7eb);
	}

	.column-title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		color: var(--text, #111827);
	}

	.count {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--gray, #6b7280);
		background: var(--gray-light, #e5e7eb);
		padding: 0.1em 0.5em;
		border-radius: 999px;
	}

	.column-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.empty {
		font-size: 0.85rem;
		color: var(--gray, #9ca3af);
		text-align: center;
		padding: 1rem;
	}
</style>
