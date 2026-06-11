<script module lang="ts">
	import KanbanCard from './KanbanCard.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, expect, userEvent } from 'storybook/test';

	const viewSpy = fn();
	const editSpy = fn();
	const deleteSpy = fn();
	const statusSpy = fn();

	const { Story } = defineMeta({
		title: 'KanbanCard',
		component: KanbanCard,
		argTypes: {
			task: { control: 'object' }
		},
		args: {
			onView: viewSpy,
			onEdit: editSpy,
			onDelete: deleteSpy,
			onStatusChange: statusSpy,
			draggable: true
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
			updated: new Date('2024-01-15').toISOString()
		}
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
			updated: new Date('2024-01-15').toISOString()
		}
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
			updated: new Date('2024-01-15').toISOString()
		}
	}}
/>

<Story
	name="Click title opens viewer"
	{template}
	args={{
		task: {
			id: '4',
			title: 'Add dark mode',
			value: '# Steps\n\n- [x] Define CSS vars\n- [ ] Update components',
			status: 'in-progress',
			updated: new Date()
		}
	}}
	play={async ({ canvas }) => {
		const title = canvas.getByText('Add dark mode');
		await userEvent.click(title);
		expect(viewSpy).toHaveBeenCalledWith({
			id: '4',
			title: 'Add dark mode',
			value: '# Steps\n\n- [x] Define CSS vars\n- [ ] Update components',
			status: 'in-progress',
			updated: expect.any(String)
		});
	}}
/>

<Story
	name="Very long title"
	{template}
	args={{
		task: {
			id: '5',
			title:
				'This is an extremely long task title that should be truncated with an ellipsis instead of wrapping or overflowing in the card',
			value: '',
			status: 'in-progress',
			updated: new Date('2024-01-15').toISOString()
		}
	}}
/>
