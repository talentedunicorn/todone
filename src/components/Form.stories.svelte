<script lang="ts" context="module">
	import { Template, Story } from '@storybook/addon-svelte-csf';
	import { within, userEvent, waitFor } from '@storybook/testing-library';
	import { expect } from '@storybook/jest';
	import Form from './Form.svelte';

	export const meta = {
		title: 'Form',
		component: Form
	};
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
		const titleField = canvas.getByLabelText('Title', { selector: 'input' });
		const contentField = canvas.getByLabelText('Content', { selector: 'textarea' });

		await userEvent.type(titleField, 'Todo title', { delay: 100 });

		expect(cancelButton).toBeDisabled();
		expect(submitButton).toBeDisabled();

		await userEvent.type(contentField, `Markdown content goes **here**`, { delay: 100 });

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
		const titleField = canvas.getByLabelText('Title', { selector: 'input' });
		const contentField = canvas.getByLabelText('Content', { selector: 'textarea' });

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
