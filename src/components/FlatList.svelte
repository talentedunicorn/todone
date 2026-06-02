<script lang="ts">
	import { slide } from 'svelte/transition';
	import { expandedTasks } from '../stores';
	import { type Todo, type TaskStatus } from '../domain/todo';
	import Button from './Button.svelte';
	import MarkdownContent from './MarkdownContent.svelte';

	interface Props {
		data: Todo[];
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange: (id: string, status: TaskStatus) => void;
	}

	let { data, onEdit, onDelete, onStatusChange }: Props = $props();

	let activeTasks = $derived(
		[...data].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
	);
</script>

<div class="list">
	{#each activeTasks as task (task.id)}
		<div
			class="task-item"
			class:done={task.status === 'done'}
			role="button"
			tabindex="0"
			onclick={() =>
				expandedTasks.update((s) => {
					const n = new Set(s);
					if (n.has(task.id)) n.delete(task.id);
					else n.add(task.id);
					return n;
				})}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					expandedTasks.update((s) => {
						const n = new Set(s);
						if (n.has(task.id)) n.delete(task.id);
						else n.add(task.id);
						return n;
					});
				}
			}}
		>
			<div class="item-header">
				<button
					class="status-badge"
					class:todo={task.status === 'todo'}
					class:in-progress={task.status === 'in-progress'}
					class:done={task.status === 'done'}
					onclick={(e) => {
						e.stopPropagation();
						if (task.status === 'done') onStatusChange(task.id, 'todo');
						else if (task.status === 'in-progress') onStatusChange(task.id, 'done');
						else onStatusChange(task.id, 'in-progress');
					}}
					aria-label="Status: {task.status}. Click to cycle."
				>
					{task.status === 'todo'
						? 'To Do'
						: task.status === 'in-progress'
							? 'In Progress'
							: 'Done'}
				</button>
				<span class="item-title">{task.title}</span>
				<div class="item-actions">
					<Button size="small" variant="link" aria-label="Edit" onclick={() => onEdit(task)}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
							<path d="m15 5 4 4" />
						</svg>
					</Button>
					<Button size="small" variant="link" aria-label="Delete" onclick={() => onDelete(task)}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M3 6h18" />
							<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
							<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
						</svg>
					</Button>
				</div>
			</div>
			{#if $expandedTasks.has(task.id) && task.value}
				<div class="item-body" transition:slide={{ duration: 150 }}>
					<MarkdownContent value={task.value} />
				</div>
			{/if}
		</div>
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

	.task-item {
		background: var(--white);
		border: 1px solid var(--gray-light);
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.task-item.done {
		opacity: 0.6;
	}

	.task-item:hover {
		border-color: var(--gray);
	}

	.item-header {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.status-badge {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.2em 0.6em;
		border-radius: 999px;
		border: none;
		cursor: pointer;
		white-space: nowrap;
		flex-shrink: 0;
		transition: opacity 0.15s;
	}

	.status-badge:hover {
		opacity: 0.8;
	}

	.status-badge.todo {
		background: var(--gray-light);
		color: var(--black);
	}

	.status-badge.in-progress {
		background: var(--yellow);
		color: var(--black);
	}

	.status-badge.done {
		background: var(--primary);
		color: var(--white);
	}

	.item-title {
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--black);
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-actions {
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.task-item:hover .item-actions,
	.task-item:focus-within .item-actions {
		opacity: 1;
	}

	.item-body {
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

	kbd {
		font-size: 0.8rem;
		padding: 0.1em 0.3em;
		border: 1px solid var(--gray-light);
		border-radius: 0.25rem;
		background: var(--gray-light);
	}
</style>
