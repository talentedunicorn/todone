import { vi, beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { MemoryTaskDatabase } from './adapters/memory-adapter';
import List from '../src/List.svelte';
import type { TaskDatabase } from '../src/adapters/database';
import { currentTab, expandedTasks, toastActions, toastMessage } from '../src/stores';
import { tick } from 'svelte';

describe('List.svelte', () => {
	let db: TaskDatabase;

	beforeEach(async () => {
		db = new MemoryTaskDatabase();
		currentTab.set('To Do');
		expandedTasks.set(new Set());
		toastMessage.set(null);
		toastActions.set(null);
	});

	async function waitForLoad() {
		await waitFor(() => expect(screen.queryByText('Loading data...')).not.toBeInTheDocument(), {
			timeout: 5000
		});
	}

	it('renders empty state when no todos', async () => {
		render(List, { db });
		await waitForLoad();
		expect(screen.getByText('Nothing found...')).toBeInTheDocument();
	});

	it('renders todos from getTodos stream', async () => {
		await db.add({ title: 'Test Todo', value: 'Content' });
		render(List, { db });
		await waitForLoad();
		expect(screen.getByText('Test Todo')).toBeInTheDocument();
	});

	it('form submit calls db.add', async () => {
		render(List, { db });
		await waitForLoad();
		const titleInput = screen.getByTestId('title');
		await fireEvent.input(titleInput, { target: { value: 'New Task' } });
		await fireEvent.submit(titleInput.closest('form')!);
		const todos = await db.exportTodos();
		expect(todos).toHaveLength(1);
		expect(todos[0].title).toBe('New Task');
	});

	it('task complete calls db.setCompleted', async () => {
		const todo = await db.add({ title: 'Test', value: 'Content' });
		render(List, { db });
		await waitForLoad();
		const completeBtn = screen.getByTestId('complete');
		await fireEvent.click(completeBtn);
		const todos = await db.exportTodos();
		expect(todos[0].completed).toBe(true);
	});

	it('search filters rendered todos', async () => {
		await db.add({ title: 'Find Me', value: '' });
		await db.add({ title: 'Other', value: '' });
		render(List, { db });
		await waitForLoad();
		const searchInput = screen.getByPlaceholderText('Type to search');
		await fireEvent.input(searchInput, { target: { value: 'Find' } });
		await waitForLoad();
		expect(screen.getByText('Find Me')).toBeInTheDocument();
		expect(screen.queryByText('Other')).not.toBeInTheDocument();
	});

	it('tab switching shows correct filtered set', async () => {
		const todo = await db.add({ title: 'Incomplete', value: '' });
		await db.setCompleted(todo.id, true);
		render(List, { db });
		await waitForLoad();
		currentTab.set('Done');
		await tick();
		await waitForLoad();
		expect(screen.getByText('Incomplete')).toBeInTheDocument();
		currentTab.set('To Do');
		await tick();
		await waitForLoad();
		expect(screen.queryByText('Incomplete')).not.toBeInTheDocument();
	});

	it('expand all button expands all tasks', async () => {
		await db.add({ title: 'Task 1', value: '' });
		await db.add({ title: 'Task 2', value: '' });
		render(List, { db });
		await waitForLoad();
		const expandBtn = screen.getByText('Expand all');
		await fireEvent.click(expandBtn);
		expect($expandedTasks.size).toBe(2);
	});

	it('collapse all button collapses all tasks', async () => {
		const todo = await db.add({ title: 'Task 1', value: '' });
		expandedTasks.set(new Set([todo.id]));
		render(List, { db });
		await waitForLoad();
		const collapseBtn = screen.getByText('Collapse all');
		await fireEvent.click(collapseBtn);
		expect($expandedTasks.size).toBe(0);
	});

	it('clear completed removes all completed todos', async () => {
		await db.add({ title: 'To Keep', value: '' });
		const done = await db.add({ title: 'Done', value: '' });
		await db.setCompleted(done.id, true);
		currentTab.set('Done');
		render(List, { db });
		await waitForLoad();
		const clearBtn = screen.getByText('Clear completed');
		await fireEvent.click(clearBtn);
		await fireEvent.click(screen.getByText('Yes'));
		const todos = await db.exportTodos();
		expect(todos).toHaveLength(1);
		expect(todos[0].title).toBe('To Keep');
	});
});
