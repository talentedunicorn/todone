<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Task from './Task.svelte';
	import { fn, expect } from 'storybook/test';

	const editSpy = fn();
	const deleteSpy = fn();
	const completeSpy = fn();
	const expandSpy = fn();
	const { Story } = defineMeta({
		title: 'Task',
		component: Task,
		argTypes: {
			title: { control: 'text' },
			value: { control: 'text' },
			updated: { control: 'date' },
			status: { control: 'select', options: ['todo', 'in-progress', 'done'] }
		},
		args: {
			onEdit: editSpy,
			onDelete: deleteSpy,
			onComplete: completeSpy,
			onToggleExpand: expandSpy
		}
	});
</script>

{#snippet template(args)}
	<Task
		{...args}
		onComplete={() => {
			args.status = args.status === 'done' ? 'todo' : 'done';
			completeSpy(args.status);
		}}
		onToggleExpand={(expanded) => {
			args.expanded = expanded;
			expandSpy(expanded);
		}}
	/>
{/snippet}

<Story
	name="Default"
	{template}
	args={{
		title: 'A task',
		value: 'Task description',
		status: 'todo',
		updated: new Date('2020-01-01')
	}}
	play={async ({ canvas, userEvent }) => {
		const editButton = canvas.getByRole('button', { name: 'Edit' });
		await userEvent.click(editButton);
		expect(editSpy).toHaveBeenCalled();
	}}
/>

<Story
	name="Expanded"
	{template}
	args={{
		title: 'Expanded task',
		value: '## Details\n- item 1\n- item 2',
		status: 'todo',
		updated: new Date('2020-01-01'),
		expanded: true
	}}
	play={async ({ canvas, userEvent }) => {
		const toggleButton = canvas.getByTestId('toggleExpand');
		await userEvent.click(toggleButton);
		expect(expandSpy).toHaveBeenCalledWith(false);
	}}
/>

<Story
	name="Complete toggle"
	{template}
	args={{
		title: 'Toggle me',
		value: 'Check this',
		status: 'todo',
		updated: new Date('2020-01-01')
	}}
	play={async ({ canvas, userEvent }) => {
		const completeButton = canvas.getByRole('button', { name: 'Mark Completed' });
		await userEvent.click(completeButton);
		expect(completeSpy).toHaveBeenCalledWith('done');
	}}
/>
