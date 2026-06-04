<script module lang="ts">
	import TaskShell from './TaskShell.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'TaskShell'
	});
</script>

<script lang="ts">
	import type { TaskDatabase, Stream } from '../adapters/database';
	import type { Todo, TaskStatus } from '../domain/todo';

	const sampleTodos: Todo[] = [
		{
			id: '1',
			title: 'Set up CI/CD',
			value: 'Configure GitHub Actions',
			status: 'done',
			updated: new Date()
		},
		{
			id: '2',
			title: 'Write documentation',
			value: 'API docs and user guide',
			status: 'in-progress',
			updated: new Date()
		},
		{
			id: '3',
			title: 'Fix login bug',
			value: 'Session expires too early',
			status: 'todo',
			updated: new Date()
		},
		{
			id: '4',
			title: 'Add dark mode',
			value: 'CSS variables approach',
			status: 'todo',
			updated: new Date()
		}
	];

	const createMockDb = (todos: Todo[]): TaskDatabase => ({
		getTodos: () => ({
			subscribe: (cb: (value: Todo[]) => void) => {
				cb(todos);
				return () => {};
			}
		}),
		add: fn().mockResolvedValue({
			id: 'new',
			title: '',
			value: '',
			status: 'todo' as TaskStatus,
			updated: new Date()
		}),
		update: fn().mockResolvedValue(undefined),
		remove: fn().mockResolvedValue(undefined),
		setStatus: fn().mockResolvedValue(undefined),
		exportTodos: fn().mockResolvedValue(todos),
		importTodos: fn().mockResolvedValue(undefined),
		getDocCount: fn().mockResolvedValue({
			todo: {
				subscribe: (cb: (n: number) => void) => {
					cb(2);
					return () => {};
				}
			} as Stream<number>,
			inProgress: {
				subscribe: (cb: (n: number) => void) => {
					cb(1);
					return () => {};
				}
			} as Stream<number>,
			done: {
				subscribe: (cb: (n: number) => void) => {
					cb(1);
					return () => {};
				}
			} as Stream<number>
		})
	});

	const mockDb = createMockDb(sampleTodos);
</script>

<Story name="Default">
	<TaskShell db={mockDb}>
		{#snippet children(data: Todo[], handlers)}
			<div style="display: flex; flex-direction: column; gap: 0.5rem;">
				{#each data as task (task.id)}
					<div
						style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 0.5rem; background: white;"
					>
						<span
							style="flex: 1; text-decoration: {task.status === 'done' ? 'line-through' : 'none'};"
						>
							{task.title}
						</span>
						<span style="font-size: 0.75rem; color: #888;">{task.status}</span>
						<button onclick={() => handlers.handleEdit(task)}>✏️</button>
						<button onclick={() => handlers.handleDelete(task)}>🗑️</button>
					</div>
				{/each}
			</div>
		{/snippet}
	</TaskShell>
</Story>
