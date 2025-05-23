<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { userEvent, waitFor, within, expect } from '@storybook/test';

	import Task from './Task.svelte';
	const { Story } = defineMeta({
		title: 'Task',
		component: Task,
		argTypes: {
			title: { control: 'text' },
			value: { control: 'text' },
			updated: { control: 'date' },
			completed: { control: 'boolean' }
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
		onComplete={() => (args.completed = true)}
		onEdit={() => console('Editing')}
		onDelete={() => console.info('Deleting')}
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
	play={({ canvasElement }) => {
		const canvas = within(canvasElement);
		const markCompletedButton = canvas.getByTestId('complete');
		const editButton = canvas.getByTestId('edit');
		const deleteButton = canvas.getByTestId('delete');
		const toggleExpandButton = canvas.getByTestId('toggleExpand');
		const content = canvas.getByTestId('content');

		userEvent.click(markCompletedButton);
		// waitFor(() => {
		// 	expect(consoleSpy).toHaveBeenCalledWith('Marked complete');
		// });

		userEvent.click(editButton);
		// waitFor(() => {
		// 	expect(consoleSpy).toHaveBeenCalledWith('Editing');
		// });

		userEvent.click(deleteButton);
		// waitFor(() => {
		// 	expect(consoleSpy).toHaveBeenCalledWith('Deleting');
		// });

		userEvent.click(toggleExpandButton);
		waitFor(() => {
			expect(content).toHaveClass('expanded');
		});

		userEvent.click(toggleExpandButton);
		waitFor(() => {
			expect(content).not.toHaveClass('expanded');
		});
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
