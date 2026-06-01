import { vi, beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import FlatList from '../src/components/FlatList.svelte';
import { expandedTasks } from '../src/stores';
import type { Todo } from '../src/domain/todo';

describe('FlatList', () => {
	let data: Todo[];
	let onEdit = vi.fn();
	let onDelete = vi.fn();
	let onStatusChange = vi.fn();

	beforeEach(() => {
		expandedTasks.set(new Set());
		onEdit = vi.fn();
		onDelete = vi.fn();
		onStatusChange = vi.fn();
	});

	it('shows empty state when no active tasks', () => {
		data = [];
		render(FlatList, { data, onEdit, onDelete, onStatusChange });
		expect(screen.queryByText(/No tasks yet/)).not.toBeNull();
	});

	it('renders task titles', () => {
		data = [
			{
				id: '1',
				title: 'My Task',
				value: '',
				status: 'todo',
				updated: new Date().toISOString()
			}
		];
		render(FlatList, { data, onEdit, onDelete, onStatusChange });
		expect(screen.queryByText('My Task')).not.toBeNull();
	});

	it('calls onStatusChange when status badge clicked', () => {
		data = [
			{
				id: '1',
				title: 'Test',
				value: '',
				status: 'todo',
				updated: new Date().toISOString()
			}
		];
		render(FlatList, { data, onEdit, onDelete, onStatusChange });
		const badge = screen.getByText('To Do');
		fireEvent.click(badge);
		expect(onStatusChange).toHaveBeenCalledWith('1', 'in-progress');
	});

	it('renders status badge labels', () => {
		data = [
			{
				id: '1',
				title: 'Todo Task',
				value: '',
				status: 'todo',
				updated: new Date().toISOString()
			},
			{
				id: '2',
				title: 'In Progress Task',
				value: '',
				status: 'in-progress',
				updated: new Date().toISOString()
			},
			{
				id: '3',
				title: 'Done Task',
				value: '',
				status: 'done',
				updated: new Date().toISOString()
			}
		];
		render(FlatList, { data, onEdit, onDelete, onStatusChange });
		expect(screen.queryByText('To Do')).not.toBeNull();
		expect(screen.queryByText('In Progress')).not.toBeNull();
		expect(screen.queryByText('Done')).not.toBeNull();
	});
});
