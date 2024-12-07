<script context="module">
	import Button from './Button.svelte';

	import { defineMeta } from '@storybook/addon-svelte-csf';
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

<Story name="Default" children={template} args={{}} />

<Story name="Primary" children={template} args={{ variant: 'primary' }} />

<Story name="Link" children={template} args={{ variant: 'link' }} />

<Story name="Disabled" children={template} args={{ disabled: true }} />

<Story name="Sizes - Small" children={template} args={{ size: 'small' }} />

<Story name="Sizes - Large" children={template} args={{ size: 'large' }} />
