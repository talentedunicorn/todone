<script lang="ts">
	import Button from './components/Button.svelte';
	import Fab from './components/Fab.svelte';
	import FullScreenEditor from './components/FullScreenEditor.svelte';
	import KanbanColumn from './components/KanbanColumn.svelte';
	import { currentView, toastActions, toastMessage, expandedTasks } from './stores';
	import { type Todo, type TaskStatus } from './domain/todo';
	import type { TaskDatabase } from './adapters/database';
	import { registerShortcuts, isInputFocused } from './lib/keyboard';

	let { db }: { db: TaskDatabase } = $props();

	let data = $state<Todo[]>([]);

	let searchInput: HTMLInputElement;

	let query = $state('');
	let showSearch = $state(false);
	let undoTask = $state<Todo | null>(null);
	let undoTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

	let isKanban = $derived($currentView === 'kanban');
	let isArchive = $derived($currentView === 'archive');

	// Track which columns are collapsed (default: all expanded)
	let collapsedColumns = $state(new Set<string>());

	const toggleCollapse = (key: string) => {
		const next = new Set(collapsedColumns);
		if (next.has(key)) {
			next.delete(key);
		} else {
			next.add(key);
		}
		collapsedColumns = next;
	};

	// Filter data by search query across all columns
	let filteredData = $derived(
		query ? data.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())) : data
	);
	let todoTasks = $derived(filteredData.filter((t) => t.status === 'todo'));
	let inProgressTasks = $derived(filteredData.filter((t) => t.status === 'in-progress'));
	let doneTasks = $derived(filteredData.filter((t) => t.status === 'done'));
	let archivedTasks = $derived(filteredData.filter((t) => t.status === 'archived'));

	// Full-screen editor dialog state (null = create mode, set = edit mode)
	let editorTask = $state<Todo | null | undefined>(undefined);
	let showEditor = $derived(editorTask !== undefined);

	// FAB is visible in kanban view when dialog is closed
	let showFab = $derived(isKanban && editorTask === undefined);

	const handleFabClick = () => {
		editorTask = null; // null = create mode
	};

	const focusSearch = () => {
		searchInput?.focus();
	};

	$effect(() => {
		const cleanup = registerShortcuts([
			{
				key: '/',
				handler: (e) => {
					// Only intercept '/' when not typing in an input
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
						// Toggle the first task in todo column
						const target = todoTasks[0];
						if (target) handleToggleComplete(target);
					}
				},
				description: 'Toggle status of first todo task'
			},
			{
				key: 'd',
				handler: () => {
					if (!isInputFocused()) {
						const target = todoTasks[0];
						if (target) handleDelete(target);
					}
				},
				description: 'Delete first todo task'
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

	const handleEdit = (selected: Todo) => {
		editorTask = { ...selected }; // set = edit mode
	};

	const handleSave = async (data: Todo) => {
		if (editorTask) {
			await db.update(data);
		} else {
			await db.add(data);
		}
		editorTask = undefined;
	};

	const handleDialogClose = () => {
		editorTask = undefined;
	};

	const handleToggleComplete = (task: Todo) => {
		const nextStatus = task.status === 'done' ? 'todo' : 'done';
		db.setStatus(task.id, nextStatus);
	};

	const handleStatusChange = (id: string, status: TaskStatus) => {
		db.setStatus(id, status);
	};

	const handleDelete = (task: Todo) => {
		// Cancel any pending undo
		if (undoTimeout) clearTimeout(undoTimeout);

		// Store the task for undo and delete it
		undoTask = { ...task };
		db.remove(task.id);

		// Show toast with Undo button
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

		// Auto-dismiss after 5 seconds
		undoTimeout = setTimeout(() => {
			undoTask = null;
			toastMessage.set(null);
			toastActions.set(null);
		}, 5000);
	};

	const dropOnColumn = (e: DragEvent, status: TaskStatus) => {
		const taskId = e.dataTransfer?.getData('text/plain');
		if (taskId) {
			handleStatusChange(taskId, status);
		}
	};

	const handleToggleExpand = (id: string, expanded: boolean) => {
		expandedTasks.update((set) => {
			if (expanded) {
				set.add(id);
			} else {
				set.delete(id);
			}
			return new Set(set);
		});
	};
</script>

<main>
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
		{#if isKanban}
			<div class="kanban">
				<KanbanColumn
					title="To Do"
					status="todo"
					tasks={todoTasks}
					collapsed={collapsedColumns.has('todo')}
					onToggleCollapse={() => toggleCollapse('todo')}
					expandedTasks={$expandedTasks}
					onToggleExpand={handleToggleExpand}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onStatusChange={handleStatusChange}
					ondragover={(e) => e.preventDefault()}
					ondrop={(e) => dropOnColumn(e, 'todo')}
				/>
				<KanbanColumn
					title="In Progress"
					status="in-progress"
					tasks={inProgressTasks}
					collapsed={collapsedColumns.has('in-progress')}
					onToggleCollapse={() => toggleCollapse('in-progress')}
					expandedTasks={$expandedTasks}
					onToggleExpand={handleToggleExpand}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onStatusChange={handleStatusChange}
					ondragover={(e) => e.preventDefault()}
					ondrop={(e) => dropOnColumn(e, 'in-progress')}
				/>
				<KanbanColumn
					title="Done"
					status="done"
					tasks={doneTasks}
					collapsed={collapsedColumns.has('done')}
					onToggleCollapse={() => toggleCollapse('done')}
					expandedTasks={$expandedTasks}
					onToggleExpand={handleToggleExpand}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onStatusChange={handleStatusChange}
					ondragover={(e) => e.preventDefault()}
					ondrop={(e) => dropOnColumn(e, 'done')}
				/>
			</div>
		{:else if isArchive}
			<div class="archive">
				{#if archivedTasks.length > 0}
					{#each archivedTasks as task (task.id)}
						{@const { id, title, value, updated } = task}
						<div class="archive-item">
							<div class="archive-title">{title}</div>
							{#if $expandedTasks.has(id) && value}
								<div class="archive-body">{value}</div>
							{/if}
						</div>
					{/each}
				{:else}
					<p class="Message">No archived tasks.</p>
				{/if}
			</div>
		{/if}
	{/await}

	<Fab onclick={handleFabClick} visible={showFab} />

	<FullScreenEditor
		open={showEditor}
		defaultValue={editorTask}
		onSave={handleSave}
		onClose={handleDialogClose}
	/>
</main>

<style>
	main {
		padding: 0 2rem;
		max-width: 100rem;
		width: 100%;
		margin: 0 auto 4rem;
		display: flex;
		flex-flow: column;
		gap: 2rem;
	}

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
	}

	.kanban {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.archive {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.archive-item {
		background: var(--white, #ffffff);
		border: 1px solid var(--gray-light, #e5e7eb);
		border-radius: 0.5rem;
		padding: 1rem;
		opacity: 0.7;
	}

	.archive-title {
		font-size: 0.95rem;
		font-weight: 500;
	}

	.archive-body {
		font-size: 0.85rem;
		color: var(--gray, #6b7280);
		margin-top: 0.5rem;
		white-space: pre-wrap;
	}

	@media (max-width: 60rem) {
		.kanban {
			grid-template-columns: 1fr;
		}
	}
</style>
