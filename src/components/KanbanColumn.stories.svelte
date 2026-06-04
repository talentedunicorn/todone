<script module lang="ts">
	import KanbanColumn from './KanbanColumn.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'KanbanColumn'
	});
</script>

<script lang="ts">
	const baseHandlers = {
		onToggleExpand: fn(),
		onEdit: fn(),
		onDelete: fn(),
		onStatusChange: fn()
	};

	const sampleTasks = [
		{
			id: '1',
			title: 'Set up CI/CD',
			value: 'Configure GitHub Actions',
			status: 'todo' as const,
			updated: new Date()
		},
		{
			id: '2',
			title: 'Write documentation',
			value: 'API docs',
			status: 'todo' as const,
			updated: new Date()
		},
		{
			id: '3',
			title: 'Add dark mode',
			value: 'CSS variables',
			status: 'todo' as const,
			updated: new Date()
		}
	];
</script>

<Story name="With tasks">
	<KanbanColumn
		title="To Do"
		status="todo"
		tasks={sampleTasks}
		collapsed={false}
		expandedTasks={new Set()}
		onToggleCollapse={fn()}
		{...baseHandlers}
	/>
</Story>

<Story name="Empty">
	<KanbanColumn
		title="In Progress"
		status="in-progress"
		tasks={[]}
		collapsed={false}
		expandedTasks={new Set()}
		onToggleCollapse={fn()}
		{...baseHandlers}
	/>
</Story>

<Story name="Collapsed">
	<KanbanColumn
		title="Done"
		status="done"
		tasks={sampleTasks}
		collapsed={true}
		expandedTasks={new Set()}
		onToggleCollapse={fn()}
		{...baseHandlers}
	/>
</Story>

<Story name="With clear button">
	<KanbanColumn
		title="Done"
		status="done"
		tasks={sampleTasks}
		collapsed={false}
		expandedTasks={new Set()}
		onToggleCollapse={fn()}
		onClear={fn()}
		clearLabel="Clear all"
		{...baseHandlers}
	/>
</Story>
