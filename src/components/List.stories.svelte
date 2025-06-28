<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import List from './List.svelte';
	import type { TodoWithExpanded } from '../stores/todos';

	const { Story } = defineMeta({
		title: 'List',
		component: List,
		argTypes: {
			items: { control: 'object' }
		}
	});

	const mockTodos: TodoWithExpanded[] = [
		{
			_id: '1',
			title: 'First task',
			value: 'This is the first task',
			completed: false,
			updated: new Date('2024-03-20').toISOString(),
			expanded: false
		},
		{
			_id: '2',
			title: 'Second task',
			value: 'This is the second task',
			completed: true,
			updated: new Date('2024-03-19').toISOString(),
			expanded: false
		},
		{
			_id: '3',
			title: 'Third task',
			value: 'This is the third task',
			completed: false,
			updated: new Date('2024-03-18').toISOString(),
			expanded: false
		}
	];

	const mockHandlers = {
		onEdit: (task: TodoWithExpanded) => console.log('Edit task:', task),
		remove: async (id: string) => console.log('Remove task:', id),
		deleteCompleted: (callback: VoidFunction) => callback(),
		setCompleted: async (id: string, completed: boolean) => {
			console.log('Set completed:', id, completed);
			return PouchDB.prototype.Response();
		},
		handleToggleExpand: (id: string, expanded: boolean) =>
			console.log('Toggle expand:', id, expanded),
		expandAll: () => console.log('Expand all'),
		collapseAll: () => console.log('Collapse all')
	};
</script>

{#snippet template(args: any)}
	<List {...args} />
{/snippet}

<Story
	{template}
	name="With Tasks"
	args={{
		items: mockTodos,
		...mockHandlers
	}}
/>

<Story
	{template}
	name="Empty List"
	args={{
		items: [],
		...mockHandlers
	}}
/>

<Story
	{template}
	name="Only Completed Tasks"
	args={{
		items: mockTodos.map((todo) => ({ ...todo, completed: true })),
		...mockHandlers
	}}
/>

<Story
	{template}
	name="Only Incomplete Tasks"
	args={{
		items: mockTodos.map((todo) => ({ ...todo, completed: false })),
		...mockHandlers
	}}
/>
