<script lang="ts">
	import Dialog from './Dialog.svelte';
	import MarkdownContent from './MarkdownContent.svelte';
	import Button from './Button.svelte';
	import type { Todo, TaskStatus } from '../domain/todo';
	import { nextStatus } from '../lib/task';
	import StatusBadge from './StatusBadge.svelte';
	import { formatTimestamp } from '../lib/format-time';
	import { useRelativeTime } from '../lib/use-relative-time.svelte';

	interface Props {
		open: boolean;
		task: Todo | null;
		onClose: () => void;
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
		onStatusChange?: (id: string, status: TaskStatus) => void;
	}

	let { open, task, onClose, onEdit, onDelete, onStatusChange }: Props = $props();

	const time = useRelativeTime(() => task?.updated);

	const handleEdit = () => {
		if (task) onEdit(task);
	};

	const handleDelete = () => {
		if (task) onDelete(task);
	};
</script>

<Dialog
	{open}
	label={task?.title ?? ''}
	maxWidth="69rem"
	onClose={() => {
		/* Dialog handles native close; caller resets task */
		onClose();
	}}
>
	{#if task}
		<div class="meta-row">
			<StatusBadge
				status={task.status}
				onclick={() => onStatusChange?.(task.id, nextStatus(task.status))}
			/>
			<span class="updated-at" title={formatTimestamp(task.updated)}>{time.relativeTime}</span>
		</div>
	{/if}
	<div class="viewer-body">
		{#if task?.value}
			<MarkdownContent value={task.value} />
		{:else}
			<p class="empty-description">No description</p>
		{/if}
	</div>
	<div class="viewer-actions">
		<Button onclick={handleEdit}>Edit</Button>
		<Button onclick={handleDelete} variant="link">Delete</Button>
	</div>
</Dialog>

<style>
	.meta-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.updated-at {
		font-size: 0.75rem;
		color: var(--gray);
	}

	.viewer-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overflow-x: auto;
		padding: 0.5rem 0;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.empty-description {
		color: var(--gray);
		font-style: italic;
		text-align: center;
		padding: 2rem;
	}

	.viewer-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding-top: 1rem;
		border-top: 1px solid var(--gray-light);
		margin-top: auto;
		flex-shrink: 0;
	}
</style>
