<script lang="ts">
	import { type Snippet } from 'svelte';
	import Fab from './Fab.svelte';
	import FullScreenEditor from './FullScreenEditor.svelte';
	import Button from './Button.svelte';
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
	let showSearch = $state(false);
	let undoTask = $state<Todo | null>(null);
	let undoTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

	// Editor dialog state
	let editorTask = $state<Todo | null | undefined>(undefined);
	let showEditor = $derived(editorTask !== undefined);

	let showFab = $derived(editorTask === undefined);

	const focusSearch = () => {
		searchInput?.focus();
	};

	const handlers = {
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
							db.add(undoTask);
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
				handler: () => {
					if (!isInputFocused()) {
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
				handler: () => {
					if (!isInputFocused()) {
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

<form class="Search">
	<label for="search" class="visually-hidden">Search by title</label>
	<input
		type="search"
		name="query"
		id="search"
		class:visually-hidden={!showSearch}
		bind:value={query}
		bind:this={searchInput}
		placeholder="Type to search"
	/>
	{#if showSearch}
		<Button
			onclick={() => {
				showSearch = false;
				query = '';
			}}
			size="small"
			variant="link"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="Hide search"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m9 6l6 6l-6 6"
				/>
			</svg>
		</Button>
	{:else}
		<Button
			onclick={() => {
				showSearch = true;
				searchInput.focus();
			}}
			size="small"
			variant="link"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				aria-label="Show search"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11.36 20.213L9 21v-8.5L4.52 7.572A2 2 0 0 1 4 6.227V4h16v2.172a2 2 0 0 1-.586 1.414L15 12m0 6a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22"
				/>
			</svg>
		</Button>
	{/if}
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
/>

<style>
	.Message {
		font-size: 1.5rem;
	}

	.Search {
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
</style>
