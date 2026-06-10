<script lang="ts">
	import type { Todo, TaskStatus } from '../domain/todo';
	import KanbanCard from './KanbanCard.svelte';

	interface Props {
		title: string;
		status: TaskStatus;
		tasks: Todo[];
		collapsed: boolean;
		onToggleCollapse: () => void;
		onView: (task: Todo) => void;
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange: (id: string, status: TaskStatus) => void;
		onClear?: () => void;
		clearLabel?: string;
		ondrop?: (e: DragEvent) => void;
		ondragover?: (e: DragEvent) => void;
	}

	let {
		title,
		status: columnStatus,
		tasks,
		collapsed,
		onToggleCollapse,
		onView,
		onEdit,
		onDelete,
		onStatusChange,
		onClear,
		clearLabel,
		ondrop,
		ondragover
	}: Props = $props();

	let isDragOver = $state(false);
	let columnEl: HTMLDivElement | undefined = $state();

	const handleDragEnter = (e: DragEvent) => {
		// Don't highlight when dragging over the source column
		const sourceStatus = e.dataTransfer?.getData('application/x-source-status');
		if (sourceStatus === columnStatus) return;

		isDragOver = true;
	};

	const handleDragLeave = (e: DragEvent) => {
		// Only clear when actually leaving the column (not entering a child element)
		const related = e.relatedTarget as Node | null;
		if (related && columnEl?.contains(related)) return;

		isDragOver = false;
	};

	const handleDrop = (e: DragEvent) => {
		isDragOver = false;
		ondrop?.(e);
	};
</script>

<div
	bind:this={columnEl}
	class="column"
	class:collapsed
	class:drag-over={isDragOver}
	role="region"
	aria-label={title}
	ondrop={handleDrop}
	{ondragover}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
>
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
		{#if onClear}
			<button
				class="clear-btn"
				onclick={(e) => {
					e.stopPropagation();
					onClear();
				}}
			>
				{clearLabel || 'Clear'}
			</button>
		{/if}
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
		<div class="column-body">
			{#if isDragOver}
				<div class="ghost-card" role="presentation" aria-hidden="true">
					<div class="ghost-badge"></div>
					<div class="ghost-title"></div>
				</div>
			{/if}
			{#each tasks as task (task.id)}
				<KanbanCard {task} {onView} {onEdit} {onDelete} {onStatusChange} />
			{/each}
			{#if tasks.length === 0 && !isDragOver}
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
		transition: background 0.15s;
	}

	.column.drag-over {
		background: color-mix(in srgb, var(--primary) 8%, var(--gray-bg));
		outline: 2px dashed var(--primary);
		outline-offset: -4px;
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
		color: var(--black);
		flex: 1;
	}

	.count {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--black);
		background: var(--gray-light);
		padding: 0.1em 0.5em;
		border-radius: 999px;
	}

	.collapse-icon {
		color: var(--black);
		transition: transform 0.15s;
		transform-origin: center;
	}

	.collapse-icon.collapsed {
		transform: rotate(-90deg);
	}

	.clear-btn {
		font-size: 0.75rem;
		padding: 0.2em 0.6em;
		border-radius: 0.25rem;
		border: 1px solid var(--gray-light);
		background: var(--white);
		color: var(--black);
		cursor: pointer;
		line-height: 1.4;
		white-space: nowrap;
	}

	.clear-btn:hover {
		background: var(--gray-light);
	}

	.column-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		overflow: hidden;
	}

	.ghost-card {
		border: 2px dashed var(--gray);
		border-radius: 0.5rem;
		padding: 0.75rem;
		min-height: 60px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		opacity: 0.5;
		pointer-events: none;
	}

	.ghost-badge {
		width: 4rem;
		height: 1.1rem;
		border-radius: 999px;
		background: var(--gray-light);
	}

	.ghost-title {
		height: 0.85rem;
		border-radius: 4px;
		background: var(--gray-light);
		width: 70%;
	}

	.empty {
		font-size: 0.85rem;
		color: var(--black);
		text-align: center;
		padding: 1rem;
	}
</style>
