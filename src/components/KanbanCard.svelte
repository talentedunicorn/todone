<script lang="ts">
	import type { Todo, TaskStatus } from '../domain/todo';
	import { nextStatus } from '../lib/task';
	import { formatTimestamp } from '../lib/format-time';
	import StatusBadge from './StatusBadge.svelte';
	import { useRelativeTime } from '../lib/use-relative-time.svelte';

	interface Props {
		task: Todo;
		onView: (task: Todo) => void;
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange: (id: string, status: TaskStatus) => void;
		draggable?: boolean;
	}

	let { task, onView, onEdit, onDelete, onStatusChange, draggable = true }: Props = $props();

	let dragging = $state(false);

	const time = useRelativeTime(() => task.updated);

	const handleDragStart = (e: DragEvent) => {
		e.dataTransfer?.setData('text/plain', task.id);
		e.dataTransfer?.setData('application/x-source-status', task.status);
		dragging = true;
	};

	const handleDragEnd = () => {
		dragging = false;
	};
</script>

<div
	class="card"
	class:dragging
	class:done={task.status === 'done'}
	{draggable}
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	role="listitem"
>
	<div class="card-header">
		<StatusBadge
			status={task.status}
			onclick={() => onStatusChange(task.id, nextStatus(task.status))}
		/>
		<div class="card-actions">
			<button class="icon-btn" onclick={() => onEdit(task)} title="Edit" aria-label="Edit">
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
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
				</svg>
			</button>
			<button class="icon-btn" onclick={() => onDelete(task)} title="Delete" aria-label="Delete">
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
					<polyline points="3 6 5 6 21 6" />
					<path
						d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
					/>
				</svg>
			</button>
		</div>
	</div>

	<div
		class="card-title"
		role="button"
		tabindex="0"
		onclick={() => onView(task)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onView(task);
			}
		}}
	>
		{task.title}
	</div>

	<span class="updated-at" title={formatTimestamp(task.updated)}>
		{time.relativeTime}
	</span>
</div>

<style>
	.card {
		background: var(--white, #ffffff);
		border: 1px solid var(--gray-light, #e5e7eb);
		border-radius: 0.5rem;
		padding: 0.75rem;
		cursor: grab;
		transition:
			box-shadow 0.2s,
			transform 0.2s,
			opacity 0.15s;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card:active {
		cursor: grabbing;
	}

	.card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.card.dragging {
		opacity: 0.3;
	}

	.card.done {
		opacity: 0.6;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.card-actions {
		display: flex;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.card:hover .card-actions {
		opacity: 1;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: none;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
		color: var(--gray, #6b7280);
		transition:
			background 0.15s,
			color 0.15s;
	}

	.icon-btn:hover {
		background: var(--gray-light, #e5e7eb);
		color: var(--text, #111827);
	}

	.card-title {
		font-size: 0.95rem;
		font-weight: 500;
		line-height: 1.4;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.updated-at {
		font-size: 0.75rem;
		color: var(--gray);
		margin-top: 0.25rem;
	}
</style>
