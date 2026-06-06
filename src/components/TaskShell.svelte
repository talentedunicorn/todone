<script lang="ts">
	import { type Snippet } from 'svelte';
	import Fab from './Fab.svelte';
	import FullScreenEditor from './FullScreenEditor.svelte';
	import ContentViewDialog from './ContentViewDialog.svelte';
	import { toastActions, toastMessage } from '../stores';
	import { type Todo, type TaskStatus } from '../domain/todo';
	import type { TaskDatabase } from '../adapters/database';
	import { registerShortcuts, isInputFocused } from '../lib/keyboard';

	type SortField = 'updated' | 'created';
	type SortDir = 'asc' | 'desc';

	interface ToolbarState {
		sortField: SortField;
		sortDir: SortDir;
		page: number;
		pageSize: number;
		totalCount: number;
		onSortChange: (field: SortField, dir: SortDir) => void;
		onPageChange: (page: number) => void;
	}

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
		toolbar?: Snippet<[state: ToolbarState]>;
		onToggleView?: () => void;
		pageSize?: number;
	}

	let { db, children, toolbar, onToggleView, pageSize = 10000 }: Props = $props();

	function loadPref<T>(key: string, fallback: T): T {
		if (typeof localStorage === 'undefined') return fallback;
		const val = localStorage.getItem(key);
		return (val !== null ? val : fallback) as unknown as T;
	}

	// --- Sort state ---
	let sortField = $state<SortField>(loadPref('todone:sortField', 'updated'));
	let sortDir = $state<SortDir>(loadPref('todone:sortDir', 'desc'));

	$effect(() => {
		localStorage.setItem('todone:sortField', sortField);
		localStorage.setItem('todone:sortDir', sortDir);
	});

	const setSort = (field: SortField, dir: SortDir) => {
		sortField = field;
		sortDir = dir;
		page = 0;
	};

	// --- Page state ---
	let page = $state(0);

	const setPage = (p: number) => {
		page = p;
	};

	// --- Data subscription ---
	let pageData = $state<Todo[]>([]);
	let totalCount = $state(0);
	let loaded = $state(false);

	// --- Search ---
	let searchInput: HTMLInputElement;
	let query = $state('');
	let debouncedQuery = $state('');

	$effect(() => {
		const timer = setTimeout(() => {
			debouncedQuery = query;
		}, 150);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		const stream = db.getTodosPage({
			sortField,
			sortDir,
			searchQuery: debouncedQuery || undefined,
			skip: page * pageSize,
			limit: pageSize
		});
		const unsub = stream.subscribe(({ todos, total }) => {
			pageData = todos;
			totalCount = total;
			loaded = true;
		});
		return () => unsub();
	});

	const focusSearch = () => {
		searchInput?.focus();
	};

	// --- Undo state ---
	let undoTask = $state<Todo | null>(null);
	let undoTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

	// --- Editor dialog state ---
	let editorTask = $state<Todo | null | undefined>(undefined);
	let showEditor = $derived(editorTask !== undefined);

	// --- Content viewer dialog state ---
	let viewTask = $state<Todo | null>(null);

	let showFab = $derived(editorTask === undefined);

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
						const target = pageData[0];
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
						const target = pageData[0];
						if (target) handlers.handleDelete(target);
					}
				},
				description: 'Delete first task'
			},
			{
				key: 'v',
				handler: (e) => {
					if (!isInputFocused()) {
						e.preventDefault();
						onToggleView?.();
					}
				},
				description: 'Toggle view'
			}
		]);

		return cleanup;
	});

	// Keep viewTask in sync when data updates from RxDB
	$effect(() => {
		const current = viewTask;
		if (current) {
			const updated = pageData.find((t) => t.id === current.id);
			if (updated && updated !== current) {
				viewTask = updated;
			}
		}
	});
</script>

<div class="Shell">
	<div class="ToolbarRow">
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

		{#if toolbar}
			<div class="ToolbarActions">
				{@render toolbar({
					sortField,
					sortDir,
					page,
					pageSize,
					totalCount,
					onSortChange: setSort,
					onPageChange: setPage
				})}
			</div>
		{/if}
	</div>

	{#if loaded}
		{@render children(pageData, handlers)}
	{:else}
		<p class="Message">Loading data... 👩🏼‍🔧</p>
	{/if}

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

	.ToolbarRow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: var(--white);
		border-radius: 0.5rem;
		border: var(--gray-light) 1px solid;
	}

	.Search {
		display: inline-flex;
		flex: 1;
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

	.Search input:focus {
		outline: none;
	}

	.ToolbarActions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.Shell {
		padding: 1rem;
		display: grid;
		gap: 1rem;
	}
</style>
