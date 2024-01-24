<script lang="ts" context="module">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import Task from './Task.svelte';
	import { userEvent, waitFor, within } from '@storybook/testing-library';
	import { jest, expect } from '@storybook/jest';

	const alertSpy = jest.spyOn(window, 'alert');

	export const meta = {
		title: 'Task',
		component: Task
	};
</script>

<Template let:args>
	<Task
		{...args}
		on:complete={() => window.alert('Marked complete')}
		on:edit={() => window.alert('Editing')}
		on:delete={() => window.alert('Deleting')}
	/>
</Template>

<Story
	name="Incomplete"
	args={{
		title: 'Sample task',
		value: 'A **new** task with some _markdown_ text.',
		updated: new Date('2023-01-01 00:00:000')
	}}
	play={({ canvasElement }) => {
		const canvas = within(canvasElement);
		const markCompletedButton = canvas.getByText('Mark Completed');
		const editButton = canvas.getByText('Edit');
		const deleteButton = canvas.getByText('Delete');

		userEvent.click(markCompletedButton);
		waitFor(() => {
			expect(alertSpy).toHaveBeenCalledWith('Marked complete');
		});

		userEvent.click(editButton);
		waitFor(() => {
			expect(alertSpy).toHaveBeenCalledWith('Editing');
		});

		userEvent.click(deleteButton);
		waitFor(() => {
			expect(alertSpy).toHaveBeenCalledWith('Deleting');
		});
	}}
/>

<Story
	name="Complete"
	args={{
		title: 'Sample task',
		value: 'A **new** task with some _markdown_ text.',
		updated: new Date('2023-01-01 00:00:000'),
		completed: true
	}}
/>
