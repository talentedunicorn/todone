<script module lang="ts">
	import KanbanCard from './KanbanCard.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect } from 'storybook/test';

	const editSpy = fn();
	const deleteSpy = fn();
	const statusSpy = fn();
	const toggleExpandSpy = fn();

	const { Story } = defineMeta({
		title: 'KanbanCard',
		component: KanbanCard,
		argTypes: {
			expanded: { control: 'boolean' },
			task: { control: 'object' }
		},
		args: {
			onToggleExpand: toggleExpandSpy,
			onEdit: editSpy,
			onDelete: deleteSpy,
			onStatusChange: statusSpy,
			expanded: false
		}
	});
</script>

{#snippet template(args)}
	<KanbanCard {...args} />
{/snippet}

<Story
	name="Todo"
	{template}
	args={{
		task: {
			id: '1',
			title: 'Set up CI/CD',
			value: 'Configure GitHub Actions workflow',
			status: 'todo',
			updated: new Date()
		},
		expanded: false
	}}
/>

<Story
	name="In progress"
	{template}
	args={{
		task: {
			id: '2',
			title: 'Write API docs',
			value: 'Document all endpoints',
			status: 'in-progress',
			updated: new Date()
		},
		expanded: false
	}}
/>

<Story
	name="Done"
	{template}
	args={{
		task: {
			id: '3',
			title: 'Fix login bug',
			value: 'Session timeout reduced',
			status: 'done',
			updated: new Date()
		},
		expanded: false
	}}
/>

<Story
	name="Expanded"
	{template}
	args={{
		task: {
			id: '4',
			title: 'Add dark mode',
			value:
				'# Steps\n\n- [x] Define CSS vars\n- [ ] Update components\n- [ ] Test in dark mode\n\n```css\n:root { --bg: white; }\n```',
			status: 'in-progress',
			updated: new Date()
		},
		expanded: true
	}}
	play={async ({ canvas, userEvent }) => {
		const toggle = canvas.getByTestId('toggleExpand');
		await userEvent.click(toggle);
		expect(toggleExpandSpy).toHaveBeenCalledWith('4', false);
	}}
/>
