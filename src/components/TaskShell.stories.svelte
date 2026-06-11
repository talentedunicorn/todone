<script module lang="ts">
	import TaskShell from './TaskShell.svelte';
	import Button from './Button.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { TaskDatabase, Stream } from '../adapters/database';
	import type { Todo, TaskStatus } from '../domain/todo';
	import { fn, expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'TaskShell',
		component: TaskShell
	});

	const sampleTodos: Todo[] = [
		{
			id: '1',
			title: 'Set up CI/CD',
			value: 'Configure GitHub Actions',
			status: 'done',
			updated: new Date('2024-01-15').toISOString()
		},
		{
			id: '2',
			title: 'Write documentation',
			value: 'API docs and user guide',
			status: 'in-progress',
			updated: new Date('2024-01-16').toISOString()
		},
		{
			id: '3',
			title: 'Fix login bug',
			value: 'Session expires too early',
			status: 'todo',
			updated: new Date('2024-01-17').toISOString()
		},
		{
			id: '4',
			title: 'Add dark mode',
			value: 'CSS variables approach',
			status: 'todo',
			updated: new Date('2024-01-18').toISOString()
		}
	];

	const createMockDb = (todos: Todo[]): TaskDatabase => ({
		getTodos: () => ({
			subscribe: (cb: (value: Todo[]) => void) => {
				cb(todos);
				return () => {};
			}
		}),
		getTodosPage: ({ searchQuery }) => ({
			subscribe: (cb: (value: { todos: Todo[]; total: number }) => void) => {
				let filtered = todos;
				if (searchQuery) {
					filtered = todos.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
				}
				const sorted = [...filtered].sort(
					(a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
				);
				cb({ todos: sorted, total: sorted.length });
				return () => {};
			}
		}),
		add: fn().mockResolvedValue({
			id: 'new',
			title: '',
			value: '',
			status: 'todo' as TaskStatus,
			updated: new Date('2024-01-15').toISOString()
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

	const statusLabels: Record<string, string> = {
		todo: 'To Do',
		'in-progress': 'In Progress',
		done: 'Done'
	};

	const statusColors: Record<string, string> = {
		todo: 'var(--gray)',
		'in-progress': 'var(--yellow)',
		done: 'var(--green)'
	};
</script>

{#snippet template(args)}
	<TaskShell db={args.db}>
		{#snippet children(data: Todo[], handlers)}
			<div class="task-list">
				{#each data as task (task.id)}
					<div class="task-item" class:done={task.status === 'done'}>
						<div class="item-header">
							<span class="status-badge" style="--badge-color: {statusColors[task.status]}">
								{statusLabels[task.status]}
							</span>
							<span class="item-title">{task.title}</span>
							<div class="item-actions">
								<Button
									size="small"
									variant="link"
									aria-label="Edit"
									onclick={() => handlers.handleEdit(task)}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
										<path d="m15 5 4 4" />
									</svg>
								</Button>
								<Button
									size="small"
									variant="link"
									aria-label="Delete"
									onclick={() => handlers.handleDelete(task)}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									</svg>
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/snippet}
	</TaskShell>
{/snippet}

<Story
	name="Default"
	{template}
	args={{ db: mockDb }}
	play={async ({ canvas }) => {
		expect(canvas.getByText('Set up CI/CD')).toBeInTheDocument();
		expect(canvas.getByText('Fix login bug')).toBeInTheDocument();
		expect(canvas.getAllByText('To Do')).toHaveLength(2);
	}}
/>

<style>
	.task-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.task-item {
		background: var(--white);
		border: 1px solid var(--gray-light);
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
	}

	.task-item.done {
		opacity: 0.6;
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.status-badge {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.2em 0.6em;
		border-radius: 999px;
		border: 1px solid var(--badge-color, var(--gray));
		color: var(--badge-color, var(--gray));
		background: transparent;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.item-title {
		flex: 1;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.task-item.done .item-title {
		text-decoration: line-through;
	}

	.item-actions {
		display: flex;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.task-item:hover .item-actions {
		opacity: 1;
	}
</style>
