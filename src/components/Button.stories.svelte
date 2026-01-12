<script module lang="ts">
	import Button from './Button.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Button',
		component: Button,
		argTypes: {
			variant: { control: 'select', options: ['', 'primary', 'link'], default: '' },
			size: { control: 'radio', options: ['', 'large', 'small'], default: '' },
			type: { control: 'select', options: ['submit', 'button', 'reset'], default: 'button' },
			selected: { control: 'boolean', default: false }
		}
	});
</script>

{#snippet template(args)}
	<Button {...args}>Click me</Button>
{/snippet}

<Story name="Default" {template} args={{}} />

<Story
	name="Primary"
	{template}
	args={{ variant: 'primary' }}
	play={async ({ canvas, userEvent }) => {
		const button = canvas.getByRole('button');
		await userEvent.click(button);
		expect(button).toBeInTheDocument();
	}}
/>

<Story name="Link" {template} args={{ variant: 'link' }} />

<Story name="Disabled" {template} args={{ disabled: true }} />

<Story name="Sizes - Small" {template} args={{ size: 'small' }} />

<Story name="Sizes - Large" {template} args={{ size: 'large' }} />
