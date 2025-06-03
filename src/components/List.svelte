<script lang="ts">
	import { fly } from 'svelte/transition';
	import Task from './Task.svelte';
	import Button from './Button.svelte';
	import type { TodoWithExpanded } from '../stores/todos';

	interface Props {
		items: TodoWithExpanded[];
		onEdit: (task: TodoWithExpanded) => void;
		remove: (id: string) => Promise<void>;
		deleteCompleted: (callback: VoidFunction) => void;
		setCompleted: (id: string, completed: boolean) => Promise<void>;
		handleToggleExpand: (id: string, expanded: boolean) => void;
		expandAll: () => void;
		collapseAll: () => void;
	}
	let {
		items,
		onEdit,
		remove,
		setCompleted,
		handleToggleExpand,
		expandAll,
		collapseAll,
		deleteCompleted
	}: Props = $props();

	const completedTodos = $derived(items.filter((i) => i.completed === true));
	const incompleteTodos = $derived(items.filter((i) => i.completed === false));

	let deleting = $state(false);

	const handleDelete = async (id: string) => {
		await remove(id);
	};

	const handleToggleComplete = async (task: TodoWithExpanded) => {
		await setCompleted(task._id!, !task.completed);
	};

	const clearCompleted = async () => {
		deleting = true;
		await Promise.all(completedTodos.filter((t) => t._id).map((t) => remove(t._id!))).finally(
			() => {
				deleting = false;
			}
		);
	};
</script>

<section>
	{#if items.length > 0}
		<aside>
			<Button variant="link" size="small" class="ToggleExpand" onclick={expandAll}
				>Expand all</Button
			>
			<Button variant="link" size="small" class="ToggleExpand" onclick={collapseAll}
				>Collapse all</Button
			>
		</aside>
		{#if incompleteTodos.length > 0}
			{#each incompleteTodos as task}
				{@const { _id, title, value, completed, updated, expanded } = task}
				<div in:fly={{ y: -100 }} out:fly={{ y: 100 }}>
					<Task
						id={`task-${_id}`}
						{title}
						{value}
						{completed}
						updated={new Date(updated)}
						{expanded}
						onEdit={() => onEdit(task)}
						onDelete={() => handleDelete(_id!)}
						onComplete={() => handleToggleComplete(task)}
						onToggleExpand={(expanded) => handleToggleExpand(_id!, expanded)}
					/>
				</div>
			{/each}
		{/if}
		{#if completedTodos.length > 0}
			<div transition:fly={{ y: 100 }}>
				<Button onclick={() => deleteCompleted(clearCompleted)} disabled={deleting}
					>Clear completed</Button
				>
			</div>
			{#each completedTodos as task}
				{@const { _id, title, value, completed, updated, expanded } = task}
				<div in:fly={{ y: -100 }} out:fly={{ y: 100 }}>
					<Task
						id={`task-${_id}`}
						{title}
						{value}
						{completed}
						updated={new Date(updated)}
						{expanded}
						onEdit={() => onEdit(task)}
						onDelete={() => handleDelete(_id!)}
						onComplete={() => handleToggleComplete(task)}
						onToggleExpand={(expanded) => handleToggleExpand(_id!, expanded)}
					/>
				</div>
			{/each}
		{/if}
	{:else}
		<p class="Message">Nothing found... 👀</p>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-flow: column;
		gap: 2rem;
	}

	.Message {
		font-size: 1.5rem;
	}

	section :global(.ToggleExpand) {
		margin-left: auto;
	}
</style>
