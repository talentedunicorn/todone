<script module>
	import Form from './Form.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Form',
		component: Form
	});
</script>

{#snippet template(args)}
	<Form {...args} onSubmit={() => {}} onClear={() => {}} onUpdate={() => {}} />
{/snippet}

<Story {template} name="Empty" />

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
