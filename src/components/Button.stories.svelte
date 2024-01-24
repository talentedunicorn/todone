<script lang="ts" context="module">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';

	export const meta = {
		title: 'Button',
		component: Button
	};
</script>

<Template let:args><Button {...args}>Click me</Button></Template>

<Story name="Default" />

<Story name="Primary" args={{ variant: 'primary' }} />

<Story name="Link" args={{ variant: 'link' }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Sizes - Small" args={{ size: 'small' }} />

<Story name="Sizes - Large" args={{ size: 'large' }} />
