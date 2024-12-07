<script module>
	import Button from './Button.svelte';
	export const meta = {
		title: 'Button',
		component: Button,
		argTypes: {
			variant: { control: 'select', options: ['', 'primary', 'link'], default: '' },
			size: { control: 'radio', options: ['', 'large', 'small'], default: '' },
			type: { control: 'select', options: ['submit', 'button', 'reset'], default: 'button' },
			selected: { control: 'boolean', default: false }
		}
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template
	>{#snippet children({ args })}
		<Button {...args}>Click me</Button>
	{/snippet}
</Template>

<Story name="Default" args={{}} />

<Story name="Primary" args={{ variant: 'primary' }} />

<Story name="Link" args={{ variant: 'link' }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Sizes - Small" args={{ size: 'small' }} />

<Story name="Sizes - Large" args={{ size: 'large' }} />
