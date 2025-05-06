<script module>
	import Form from './Form.svelte';
	import { within, userEvent, waitFor, expect } from '@storybook/test';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Form',
		component: Form
	});
</script>

{#snippet template(args)}
	<Form {...args} onSubmit={() => {}} onClear={() => {}} onUpdate={() => {}} />
{/snippet}

<Story
	{template}
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
	{template}
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
