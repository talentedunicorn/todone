<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Task from './Task.svelte';
	import { fn, expect } from 'storybook/test';

	const editSpy = fn();
	const { Story } = defineMeta({
		title: 'Task',
		component: Task,
		argTypes: {
			title: { control: 'text' },
			value: { control: 'text' },
			updated: { control: 'date' },
			completed: { control: 'boolean' }
		},
		args: {
			onEdit: editSpy
		}
	});
</script>

{#snippet template(args)}
	<Task
		{...args}
		onComplete={() => (args.completed = !args.completed)}
		onToggleExpand={() => (args.expanded = !args.expanded)}
	/>
{/snippet}

<Story
	name="Default"
	{template}
	args={{
		title: 'A task',
		value: 'Task description',
		completed: false,
		updated: new Date()
	}}
	play={async ({ canvas, userEvent }) => {
		const editButton = canvas.getByRole('button', { name: 'Edit' });

		await userEvent.click(editButton);
		expect(editSpy).toHaveBeenCalled();
	}}
/>
