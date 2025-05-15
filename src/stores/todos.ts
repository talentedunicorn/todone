import { z } from 'zod';
import { derived, writable } from 'svelte/store';
import type { Todo } from '../lib/pouchdb';
import {
	getTodos,
	add,
	setCompleted,
	update as updateTodo,
	remove,
	db,
	exportTodos,
	importTodos
} from '../db';
import { toastMessage } from '../stores';

type TodoWithExpanded = Todo & { expanded: boolean };
type TodoStore = {
	todos: TodoWithExpanded[];
	processing: boolean;
};

const createTodoStore = () => {
	const { update, subscribe } = writable<TodoStore>({
		todos: [],
		processing: false
	});

	const loadData = async (query: string) => {
		const data = await getTodos(query);
		update((store) => ({
			...store,
			todos: data.docs.map((t) => ({ ...t, expanded: false }))
		}));
	};

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
			toastMessage.set('Data exported successfully.');
		} catch (e: any) {
			toastMessage.set(e.message);
		} finally {
			update((store) => ({ ...store, processing: true }));
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
				toastMessage.set('Imported data successfully');
			} catch (e) {
				toastMessage.set('Failed to import data');
			}
		} else {
			toastMessage.set('Invalid file selected. Please select an exported file');
			// importForm.reset();
		}
	};

	// Listen to changes and update store
	db.changes({
		live: true,
		include_docs: true
	}).on('change', (change) => {
		if (change.doc) {
			update((store: TodoStore) => {
				const changedDoc = change.doc as Todo;
				const index = store.todos.findIndex((doc) => doc._id === changedDoc._id);

				if (change.deleted) {
					console.info(`[Changes:Delete]:`, change);
					// Handle deletion
					if (index !== -1) {
						return {
							...store,
							todos: [...store.todos.slice(0, index), ...store.todos.slice(index + 1)]
						};
					}
				} else {
					// Handle create or update
					if (index !== -1) {
						console.info(`[Changes:Update]:`, change);
						// Update existing
						const newDocs = [...store.todos];
						newDocs[index] = { ...changedDoc, expanded: false };
						return { ...store, todos: newDocs };
					} else {
						console.info(`[Changes:Create]:`, change);
						// Add new
						return { ...store, todos: [...store.todos, { ...changedDoc, expanded: false }] };
					}
				}
				return store; // No change affecting the current store structure
			});
		}
	});

	return {
		subscribe,
		loadData,
		add,
		update: updateTodo,
		remove,
		setCompleted,
		handleToggleExpand,
		expandAll,
		collapseAll,
		exportTodos,
		importTodos,
		exportData,
		importData
	};
};

const todoStore = createTodoStore();

const sortByDate = (a: Todo, b: Todo) =>
	new Date(b.updated).getTime() - new Date(a.updated).getTime();
export const completedTodos = derived(todoStore, (store) => ({
	...store,
	todos: store.todos.sort(sortByDate).filter((t) => t.completed === true)
}));
export const incompleteTodos = derived(todoStore, (store) => ({
	...store,
	todos: store.todos.sort(sortByDate).filter((t) => t.completed !== true)
}));

export default todoStore;
