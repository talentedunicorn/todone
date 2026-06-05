<script lang="ts">
	import Dialog from './Dialog.svelte';
	import MarkdownContent from './MarkdownContent.svelte';
	import Button from './Button.svelte';
	import type { Todo } from '../domain/todo';

	interface Props {
		open: boolean;
		task: Todo | null;
		onClose: () => void;
		onEdit: (task: Todo) => void;
		onDelete: (task: Todo) => void;
	}

	let { open, task, onClose, onEdit, onDelete }: Props = $props();

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
	maxWidth="36rem"
	onClose={() => {
		/* Dialog handles native close; caller resets task */
		onClose();
	}}
>
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
