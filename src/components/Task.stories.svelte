<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';

	import Task from './Task.svelte';
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
			onEdit: fn(),
			onDelete: fn()
		}
	});

	const taskContent =
		'A **task** written in _markdown_. \n \
Includes lists \n \
- Unordered \n \
- Ordered \n \
- Checkboxed \n \
1. One \n \
1. Two \n \
1. Three \n \
- [x] Checked \n \
- [ ] Unchecked \n \
> If that is not convincing enough... \n \n \
| Benefits of markdown | Notes | \n \
| :--- | :--- | \n \
| Reduces boilerplate code compared to HTML | | \n \
| Allows metadata through frontmatter | | \n \
| MDX supports components | Needs to be `.mdx` format |';
</script>

{#snippet template(args)}
	<Task
		{...args}
		onComplete={() => (args.completed = !args.completed)}
		onToggleExpand={() => (args.expanded = !args.expanded)}
	/>
{/snippet}

<Story
	{template}
	name="Incomplete"
	args={{
		title: 'Test task',
		value: taskContent,
		updated: new Date('2023-01-01 00:00:000')
	}}
	play={async ({ canvas, userEvent, args }) => {
		const markCompletedButton = canvas.getByTestId('complete');
		const editButton = canvas.getByTestId('edit');
		const deleteButton = canvas.getByTestId('delete');
		const toggleExpandButton = canvas.getByTestId('toggleExpand');
		const content = canvas.getByTestId('content');

		await userEvent.click(markCompletedButton);
		// expect(args.onComplete).toHaveBeenCalled();

		await userEvent.click(editButton);
		expect(args.onEdit).toHaveBeenCalled();

		await userEvent.click(toggleExpandButton);
		expect(content).toHaveClass('expanded');

		await userEvent.click(toggleExpandButton);
		expect(content).not.toHaveClass('expanded');

		await userEvent.click(deleteButton);
		// expect(args.onDelete).toHaveBeenCalled();
	}}
/>

<Story
	{template}
	name="Complete"
	args={{
		title: 'Sample task',
		value: 'A **new** task with some _markdown_ text.',
		updated: new Date('2023-01-01 00:00:000'),
		completed: true
	}}
/>
