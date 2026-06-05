<script lang="ts">
	import { type Todo, type TaskStatus } from '../domain/todo';
	import KanbanCard from './KanbanCard.svelte';

	interface Props {
		data: Todo[];
		onView: (task: Todo) => void;
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange: (id: string, status: TaskStatus) => void;
	}

	let { data, onView, onEdit, onDelete, onStatusChange }: Props = $props();

	let activeTasks = $derived(
		[...data].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
	);
</script>

<div class="list">
	{#each activeTasks as task (task.id)}
		<KanbanCard {task} draggable={false} {onView} {onEdit} {onDelete} {onStatusChange} />
	{:else}
		<p class="empty">No tasks yet. Press <kbd>n</kbd> or tap + to create one.</p>
	{/each}
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.empty {
		font-size: 0.9rem;
		color: var(--gray);
		text-align: center;
		padding: 2rem;
	}

	kbd {
		font-size: 0.8rem;
		padding: 0.1em 0.3em;
		border: 1px solid var(--gray-light);
		border-radius: 0.25rem;
		background: var(--gray-light);
	}
</style>
