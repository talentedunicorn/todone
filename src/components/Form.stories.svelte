<script context="module">
	import Form from './Form.svelte';

	export const meta = {
		title: 'Form',
		component: Form
	};
</script>

<script lang="ts">
	import { Template, Story } from '@storybook/addon-svelte-csf';
	import { within, userEvent, waitFor, expect } from '@storybook/test';
</script>

<Template let:args>
	<Form {...args} on:submit={() => {}} on:clear={() => {}} />
</Template>

<Story
	name="Empty"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const cancelButton = canvas.getByTestId('cancel');
		const submitButton = canvas.getByTestId('submit');
		const titleField = canvas.getByTestId('title');

		const contentField = canvas.getByTestId('content');

		await userEvent.type(titleField, 'Todo title', { delay: 100 });

		expect(cancelButton).toBeDisabled();
		expect(submitButton).toBeDisabled();

		userEvent.click(contentField);
		await userEvent.keyboard(`Markdown content goes **here**`, { delay: 100 });

		expect(cancelButton).toBeEnabled();
		expect(submitButton).toBeEnabled();
		userEvent.click(submitButton);

		waitFor(() => {
			expect(cancelButton).toBeDisabled();
			expect(submitButton).toBeDisabled();
			expect(titleField.textContent).toBe('');
			expect(contentField.textContent).toBe('');
		});
	}}
/>

<Story
	name="With default content"
	args={{
		defaultValue: {
			title: 'Things to do',
			value: '- Write todos in **markdown** \n- Because why not'
		}
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const cancelButton = canvas.getByTestId('cancel');
		const updateButton = canvas.getByTestId('submit');
		const titleField = canvas.getByTestId('title');

		const contentField = canvas.getByTestId('content');

		expect(updateButton).toBeInTheDocument();
		userEvent.click(updateButton);

		waitFor(() => {
			const submitButton = canvas.getByTestId('submit');
			expect(titleField.textContent).toBe('');
			expect(contentField.textContent).toBe('');
			expect(submitButton).toBeDisabled();
			expect(cancelButton).toBeDisabled();
		});
	}}
/>
