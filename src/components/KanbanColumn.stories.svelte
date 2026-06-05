<script module lang="ts">
	import KanbanColumn from './KanbanColumn.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { Todo, TaskStatus } from '../domain/todo';
	import { fn, expect } from 'storybook/test';

	const editSpy = fn();
	const deleteSpy = fn();
	const statusSpy = fn();
	const toggleExpandSpy = fn();
	const toggleCollapseSpy = fn();
	const clearSpy = fn();

	const { Story } = defineMeta({
		title: 'KanbanColumn',
		component: KanbanColumn,
		argTypes: {
			collapsed: { control: 'boolean' },
			title: { control: 'text' },
			status: { control: 'select', options: ['todo', 'in-progress', 'done'] }
		},
		args: {
			onToggleExpand: toggleExpandSpy,
			onEdit: editSpy,
			onDelete: deleteSpy,
			onStatusChange: statusSpy,
			onToggleCollapse: toggleCollapseSpy,
			expandedTasks: new Set()
		}
	});

	const sampleTasks: Todo[] = [
		{
			id: '1',
			title: 'Set up CI/CD',
			value: 'Configure GitHub Actions',
			status: 'todo',
			updated: new Date()
		},
		{
			id: '2',
			title: 'Write documentation',
			value: 'API docs',
			status: 'todo',
			updated: new Date()
		},
		{
			id: '3',
			title: 'Add dark mode',
			value: 'CSS variables',
			status: 'todo',
			updated: new Date()
		}
	];
</script>

{#snippet template(args)}
	<KanbanColumn {...args} />
{/snippet}

<Story
	name="With tasks"
	{template}
	args={{ title: 'To Do', status: 'todo' as TaskStatus, tasks: sampleTasks, collapsed: false }}
	play={async ({ canvas }) => {
		expect(await canvas.findByRole('heading', { name: 'To Do' })).toBeInTheDocument();
		expect(await canvas.findByText('Set up CI/CD')).toBeInTheDocument();
	}}
/>

<Story
	name="Empty"
	{template}
	args={{ title: 'In Progress', status: 'in-progress' as TaskStatus, tasks: [], collapsed: false }}
	play={async ({ canvas }) => {
		expect(await canvas.findByText('No tasks')).toBeInTheDocument();
	}}
/>

<Story
	name="Collapsed"
	{template}
	args={{ title: 'Done', status: 'done' as TaskStatus, tasks: sampleTasks, collapsed: true }}
	play={async ({ canvas }) => {
		expect(canvas.queryByText('Set up CI/CD')).not.toBeInTheDocument();
	}}
/>

<Story
	name="With clear button"
	{template}
	args={{
		title: 'Done',
		status: 'done' as TaskStatus,
		tasks: sampleTasks,
		collapsed: false,
		onClear: clearSpy,
		clearLabel: 'Clear all'
	}}
	play={async ({ canvas, userEvent }) => {
		const clearBtn = await canvas.findByText('Clear all');
		await userEvent.click(clearBtn);
		expect(clearSpy).toHaveBeenCalled();
	}}
/>
