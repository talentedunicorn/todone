<script module lang="ts">
	import Button from './Button.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'Button',
		component: Button,
		parameters: { layout: 'centered' },
		argTypes: {
			variant: { control: 'select', options: ['', 'primary', 'link', 'pill'], default: '' },
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

<Story name="Pill" {template} args={{ variant: 'pill' }} />

<Story name="Disabled" {template} args={{ disabled: true }} />

<Story name="Sizes - Small" {template} args={{ size: 'small' }} />

<Story name="Sizes - Large" {template} args={{ size: 'large' }} />

<!-- Combo variants -->
<Story name="Primary + Large" {template} args={{ variant: 'primary', size: 'large' }} />

<Story name="Primary + Small" {template} args={{ variant: 'primary', size: 'small' }} />

<Story name="Primary + Disabled" {template} args={{ variant: 'primary', disabled: true }} />

<Story
	name="Selected pill"
	{template}
	args={{ variant: 'pill', selected: true }}
	play={async ({ canvas }) => {
		const button = canvas.getByRole('button');
		expect(button.className).toContain('selected');
	}}
/>
