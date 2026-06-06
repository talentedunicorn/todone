<script lang="ts">
	import { type Snippet } from 'svelte';
	import Fab from './Fab.svelte';
	import FullScreenEditor from './FullScreenEditor.svelte';
	import ContentViewDialog from './ContentViewDialog.svelte';
	import { toastActions, toastMessage } from '../stores';
	import { type Todo, type TaskStatus } from '../domain/todo';
	import type { TaskDatabase } from '../adapters/database';
	import { registerShortcuts, isInputFocused } from '../lib/keyboard';

	interface Props {
		db: TaskDatabase;
		children: Snippet<
			[
				data: Todo[],
				handlers: {
					handleViewContent: (task: Todo) => void;
					handleEdit: (task: Todo) => void;
					handleDelete: (task: Todo) => void;
					handleStatusChange: (id: string, status: TaskStatus) => void;
					handleToggleComplete: (task: Todo) => void;
				}
			]
		>;
	}

	let { db, children }: Props = $props();

	let data = $state<Todo[]>([]);

	let searchInput: HTMLInputElement;
	let query = $state('');
	let undoTask = $state<Todo | null>(null);
	let undoTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

	// Editor dialog state
	let editorTask = $state<Todo | null | undefined>(undefined);
	let showEditor = $derived(editorTask !== undefined);

	// Content viewer dialog state
	let viewTask = $state<Todo | null>(null);

	let showFab = $derived(editorTask === undefined);

	const focusSearch = () => {
		searchInput?.focus();
	};

	const handlers = {
		handleViewContent: (task: Todo) => {
			viewTask = task;
		},
		handleEdit: (selected: Todo) => {
			editorTask = { ...selected };
		},
		handleDelete: (task: Todo) => {
			if (undoTimeout) clearTimeout(undoTimeout);
			undoTask = { ...task };
			db.remove(task.id);
			toastMessage.set(`Deleted "${task.title}"`);
			toastActions.set([
				{
					label: 'Undo',
					callback: () => {
						if (undoTask) {
							db.restore(undoTask);
							undoTask = null;
						}
						toastMessage.set(null);
						toastActions.set(null);
						if (undoTimeout) clearTimeout(undoTimeout);
					}
				}
			]);
			undoTimeout = setTimeout(() => {
				undoTask = null;
				toastMessage.set(null);
				toastActions.set(null);
			}, 5000);
		},
		handleStatusChange: (id: string, status: TaskStatus) => {
			db.setStatus(id, status);
		},
		handleToggleComplete: (task: Todo) => {
			const nextStatus = task.status === 'done' ? 'todo' : 'done';
			db.setStatus(task.id, nextStatus);
		}
	};

	const handleFabClick = () => {
		editorTask = null;
	};

	const handleSave = async (todo: Todo) => {
		if (editorTask) {
			await db.update(todo);
		} else {
			await db.add(todo);
		}
		editorTask = undefined;
	};

	const handleDialogClose = () => {
		editorTask = undefined;
	};

	$effect(() => {
		const cleanup = registerShortcuts([
			{
				key: '/',
				handler: (e) => {
					if (!isInputFocused()) {
						e.preventDefault();
						focusSearch();
					}
				},
				description: 'Focus search'
			},
			{
				key: 'Escape',
				handler: () => {
					if (showEditor) {
						editorTask = undefined;
					} else if ($toastMessage) {
						toastMessage.set(null);
						toastActions.set(null);
					}
				},
				description: 'Close editor / close toast'
			},
			{
				key: 'n',
				handler: (e) => {
					if (!isInputFocused()) {
						e.preventDefault();
						handleFabClick();
					}
				},
				description: 'New task'
			},
			{
				key: ' ',
				handler: (e) => {
					if (!isInputFocused()) {
						e.preventDefault();
						const active = data.filter(
							(t) => t.status === 'todo' || t.status === 'in-progress' || t.status === 'done'
						);
						const target = active[0];
						if (target) handlers.handleToggleComplete(target);
					}
				},
				description: 'Toggle status of first task'
			},
			{
				key: 'd',
				handler: (e) => {
					if (!isInputFocused()) {
						e.preventDefault();
						const active = data.filter(
							(t) => t.status === 'todo' || t.status === 'in-progress' || t.status === 'done'
						);
						const target = active[0];
						if (target) handlers.handleDelete(target);
					}
				},
				description: 'Delete first task'
			}
		]);

		return cleanup;
	});

	const loadTodos = async () => {
		const todos = await db.getTodos();
		todos?.subscribe((tasks) => {
			data = tasks;
		});
	};
</script>

<div class="Shell">
	<form class="Search">
		<label for="search" class="visually-hidden">Search by title</label>
		<input
			type="search"
			name="query"
			id="search"
			bind:value={query}
			bind:this={searchInput}
			placeholder="Type to search"
		/>
	</form>

	{#await loadTodos()}
		<p class="Message">Loading data... 👩🏼‍🔧</p>
	{:then _}
		{@render children(
			data.filter((t) => !query || t.title.toLowerCase().includes(query.toLowerCase())),
			handlers
		)}
	{/await}

	<Fab onclick={handleFabClick} visible={showFab} />

	<FullScreenEditor
		open={showEditor}
		defaultValue={editorTask}
		onSave={handleSave}
		onClose={handleDialogClose}
		onDelete={handlers.handleDelete}
	/>

	<ContentViewDialog
		open={viewTask !== null}
		task={viewTask}
		onClose={() => (viewTask = null)}
		onEdit={(task) => {
			viewTask = null;
			handlers.handleEdit(task);
		}}
		onDelete={(task) => {
			viewTask = null;
			handlers.handleDelete(task);
		}}
		onStatusChange={handlers.handleStatusChange}
	/>
</div>

<style>
	.Message {
		font-size: 1.5rem;
	}

	.Search {
		margin-left: auto;
		align-self: flex-end;
		display: inline-flex;
		gap: 1rem;
		padding: 0.5rem;
		background: var(--white);
		border-radius: 0.5rem;
		border: var(--gray-light) 1px solid;
	}

	.Search input {
		flex: 1;
		border: none;
		border-radius: 0.5rem;
		padding: 0.5em;
		font-size: 1rem;
		font-family: inherit;
		background: transparent;
		color: var(--black);
	}

	.Shell {
		padding: 1rem;
		display: grid;
		gap: 1rem;
	}
</style>
