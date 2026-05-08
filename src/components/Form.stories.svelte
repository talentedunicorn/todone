<script module>
	import Form from './Form.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';

	const submitSpy = fn();
	const clearSpy = fn();
	const updateSpy = fn();

	const { Story } = defineMeta({
		title: 'Form',
		component: Form,
		decorators: [
			(story, { args }) => {
				if (args.theme) {
					document.documentElement.dataset.theme = args.theme;
				}
				return story();
			}
		],
		argTypes: {
			theme: {
				control: 'select',
				options: ['light', 'dark'],
				description: 'Theme to apply'
			}
		},
		args: {
			onSubmit: submitSpy,
			onClear: clearSpy,
			onUpdate: updateSpy
		}
	});
</script>

{#snippet template(args)}
	<Form {...args} />
{/snippet}

<Story
	{template}
	name="Empty"
	args={{ enableEditor: true }}
	play={async ({ canvas }) => {
		const titleInput = canvas.getByPlaceholderText('Start something...');
		expect(titleInput).toBeInTheDocument();
	}}
/>

<Story
	{template}
	name="With default value"
	args={{
		enableEditor: true,
		defaultValue: {
			title: 'Things to do',
			value: '- Write todos'
		}
	}}
	play={async ({ canvas }) => {
		const titleInput = canvas.getByDisplayValue('Things to do');
		expect(titleInput).toBeInTheDocument();
	}}
/>

<Story
	{template}
	name="Submit fires callback"
	args={{ enableEditor: false }}
	play={async ({ canvas, userEvent }) => {
		const titleInput = canvas.getByPlaceholderText('Start something...');
		await userEvent.type(titleInput, 'New task');
		const submitButton = canvas.getByRole('button', { name: 'Submit' });
		await userEvent.click(submitButton);
		expect(submitSpy).toHaveBeenCalled();
	}}
/>
