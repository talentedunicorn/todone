<script lang="ts">
	import type { Todo } from '../domain/todo';
	import type { TaskStatus } from '../domain/todo';
	import MarkdownContent from './MarkdownContent.svelte';

	interface Props {
		task: Todo;
		expanded: boolean;
		onToggleExpand: (id: string, expanded: boolean) => void;
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange: (id: string, status: TaskStatus) => void;
	}

	let { task, expanded, onToggleExpand, onEdit, onDelete, onStatusChange }: Props = $props();

	const statusColors: Record<string, string> = {
		todo: 'var(--gray, #9ca3af)',
		'in-progress': 'var(--yellow, #eab308)',
		done: 'var(--green, #22c55e)',
		archived: 'var(--gray-light, #d1d5db)'
	};

	const statusLabels: Record<string, string> = {
		todo: 'To Do',
		'in-progress': 'In Progress',
		done: 'Done',
		archived: 'Archived'
	};

	const cycleStatus = () => {
		const order: TaskStatus[] = ['todo', 'in-progress', 'done'];
		const idx = order.indexOf(task.status);
		const next = idx < order.length - 1 ? order[idx + 1] : order[0];
		onStatusChange(task.id, next);
	};
</script>

<div
	class="card"
	class:expanded
	draggable="true"
	ondragstart={(e) => e.dataTransfer?.setData('text/plain', task.id)}
	role="listitem"
>
	<div class="card-header">
		<button
			class="status-badge"
			style="--badge-color: {statusColors[task.status] || statusColors.todo}"
			onclick={cycleStatus}
			title={statusLabels[task.status]}
		>
			{statusLabels[task.status]}
		</button>
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
			<button
				class="icon-btn"
				onclick={() => onToggleExpand(task.id, !expanded)}
				title={expanded ? 'Collapse' : 'Expand'}
				aria-label={expanded ? 'Collapse' : 'Expand'}
				data-testid="toggleExpand"
			>
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
					{#if expanded}
						<polyline points="18 15 12 9 6 15" />
					{:else}
						<polyline points="6 9 12 15 18 9" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<div
		class="card-title"
		role="button"
		tabindex="0"
		onclick={() => onToggleExpand(task.id, !expanded)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onToggleExpand(task.id, !expanded);
			}
		}}
	>
		{task.title}
	</div>

	{#if expanded && task.value}
		<div class="card-body">
			<MarkdownContent value={task.value} />
		</div>
	{/if}
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
			transform 0.2s;
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

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.status-badge {
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.2em 0.6em;
		border-radius: 999px;
		border: 1px solid var(--badge-color, var(--gray));
		color: var(--badge-color, var(--gray));
		background: transparent;
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
	}

	.status-badge:hover {
		background: color-mix(in srgb, var(--badge-color, var(--gray)) 10%, transparent);
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
		word-break: break-word;
	}

	.card-body {
		font-size: 0.85rem;
		line-height: 1.5;

		:global(.shiki) {
			padding: 0.5rem;
			font-size: 0.85rem;
			border-radius: 0.25rem;
			overflow: auto;
		}

		:global(.TableWrapper) {
			overflow-x: auto;
			border: 1px solid var(--gray-light);
			border-radius: 0.5rem;
		}

		:global(img) {
			max-width: 100%;
			border-radius: 0.25rem;
		}
	}
</style>
