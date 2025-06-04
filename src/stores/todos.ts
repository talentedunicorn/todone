import { z } from 'zod';
import { derived, writable } from 'svelte/store';
import type { Todo } from '../lib/pouchdb';
import { getTodos, add, setCompleted, update, remove, db, exportTodos, importTodos } from '../db';
import toastStore from './toast';
import { sortTodoByDateDesc } from '../lib/helpers';

const { setMessage } = toastStore;

export type TodoWithExpanded = Todo & { expanded: boolean };
type TodoStore = {
	todos: TodoWithExpanded[];
	query: string;
	processing: boolean;
	page: number;
	limit: number;
};

const createTodoStore = () => {
	const { update, subscribe } = writable<TodoStore>({
		todos: [],
		query: '',
		processing: false,
		page: 1,
		limit: 5
	});

	const loadData = async () => {
		console.count('[Loading data...]');
		const data = await getTodos();
		update((store) => ({
			...store,
			todos: data.rows
				.filter((t) => !t.doc?._id.startsWith('_design')) // Filter out _design docs
				.map((t) => ({ ...t.doc!, expanded: false })) // Add expanded: false to each todo
		}));
	};

	const setPage = (page: number) =>
		update((store) => ({
			...store,
			page
		}));

	const setLimit = (limit: number) => update((store) => ({ ...store, limit, page: 1 }));

	const setQuery = (query: string) => update((store) => ({ ...store, query }));

	const handleToggleExpand = (id: string, expanded: boolean) => {
		update((store) => {
			const taskIndex = store.todos.findIndex((t) => t._id === id);

			if (taskIndex > -1) {
				const todos = [...store.todos];
				todos[taskIndex] = { ...todos[taskIndex], expanded };
				return {
					...store,
					todos
				};
			}

			return store;
		});
	};

	const expandAll = async () => {
		update((store) => {
			const todos = [...store.todos.map((t) => ({ ...t, expanded: true }))];
			return { ...store, todos };
		});
	};

	const collapseAll = async () => {
		update((store) => {
			const todos = [...store.todos.map((t) => ({ ...t, expanded: false }))];
			return { ...store, todos };
		});
	};

	const exportData = async () => {
		update((store) => ({ ...store, processing: true }));
		try {
			const todos = await exportTodos();

			if (todos.length < 1) throw Error('No tasks found in the database.');

			const blob = new Blob([JSON.stringify(todos)], { type: 'text/json' });
			const name = `ToDone_${new Date().toISOString()}.json`;
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = name;

			document.body.appendChild(link);

			link.click();

			document.body.removeChild(link);
			setMessage('Data exported successfully.');
		} catch (e: any) {
			setMessage(e.message);
		} finally {
			update((store) => ({ ...store, processing: false }));
		}
	};

	const importData = async (files: FileList) => {
		const file = files[0];
		const data: Todo[] = JSON.parse((await file?.text()) ?? '')
			// Allow importing old data format by converting 'id' to '_id' TODO: Remove this later
			.map((t: any) => ({
				_id: t.id,
				...t
			}));
		const schema = z.array(
			z.object({
				_id: z.string(),
				title: z.string(),
				value: z.string(),
				completed: z.boolean(),
				updated: z.coerce.date()
			})
		);

		const result = schema.safeParse(data);
		if (result.success) {
			try {
				await importTodos(data);
				setMessage('Imported data successfully');
			} catch (e) {
				setMessage('Failed to import data');
			}
		} else {
			setMessage('Invalid file selected. Please select an exported file');
		}
	};

	// Listen to changes and update store
	db.changes({
		live: true
	}).on('change', async () => {
		await loadData();
	});

	return {
		subscribe,
		loadData,
		handleToggleExpand,
		expandAll,
		collapseAll,
		exportData,
		importData,
		setPage,
		setLimit,
		setQuery
	};
};

const todoStore = createTodoStore();

const {
	loadData,
	handleToggleExpand,
	collapseAll,
	expandAll,
	exportData,
	importData,
	setPage,
	setLimit,
	setQuery
} = todoStore;

export {
	add,
	update,
	remove,
	setCompleted,
	handleToggleExpand,
	expandAll,
	collapseAll,
	loadData,
	exportData,
	importData,
	setPage,
	setLimit,
	setQuery
};

const filteredTodos = derived(todoStore, (store) => ({
	...store,
	todos: store.todos.filter((t) => {
		const { query } = store;
		// Return all _design docs
		if (t._id?.startsWith('_design')) return t;

		// Filter by search query
		if (
			t.title.toLowerCase().includes(query.toLowerCase()) ||
			t.value.toLowerCase().includes(query.toLowerCase())
		)
			return t;
	})
}));

export const sortedTodos = derived(filteredTodos, (store) => ({
	...store,
	todos: store.todos.sort(sortTodoByDateDesc)
}));

export const paginatedTodos = derived(sortedTodos, (store) => {
	const { page, limit, todos } = store;
	const start = (page - 1) * limit;
	const end = start + limit;
	return {
		...store,
		todos: todos.slice(start, end)
	};
});
