<script module>
	import Form from './Form.svelte';
	import { expect } from 'storybook/test';
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
	play={async ({ canvas, userEvent }) => {
		const cancelButton = canvas.getByTestId('cancel');
		const submitButton = canvas.getByTestId('submit');
		const titleField = canvas.getByTestId('title');

		const contentField = canvas.getByTestId('content');

		await userEvent.type(titleField, 'Todo title');

		expect(cancelButton).toBeDisabled();
		expect(submitButton).toBeDisabled();

		userEvent.click(contentField);
		await userEvent.keyboard(`Markdown content goes **here**`);

		expect(cancelButton).toBeEnabled();
		expect(submitButton).toBeEnabled();
		// Clear content
		await userEvent.click(cancelButton);

		expect(cancelButton).toBeDisabled();
		expect(submitButton).toBeDisabled();
		expect(titleField.textContent).toBe('');
		expect(contentField.textContent).toBe('');
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
	play={async ({ canvas, userEvent }) => {
		const cancelButton = canvas.getByTestId('cancel');
		const updateButton = canvas.getByTestId('submit');
		const titleField = canvas.getByTestId('title');

		const contentField = canvas.getByTestId('content');

		expect(updateButton).toBeInTheDocument();
		await userEvent.click(updateButton);

		const submitButton = canvas.getByTestId('submit');
		expect(titleField.textContent).toBe('');
		expect(contentField.textContent).toBe('');
		expect(submitButton).toBeDisabled();
		expect(cancelButton).toBeDisabled();
	}}
/>
