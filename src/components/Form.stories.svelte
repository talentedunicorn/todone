<script module>
	import Form from './Form.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

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
		}
	});
</script>

{#snippet template(args)}
	<Form {...args} onSubmit={() => {}} onClear={() => {}} onUpdate={() => {}} />
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
