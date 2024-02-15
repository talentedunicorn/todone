<script context="module">
	import Logo from './Logo.svelte';

	export const meta = {
		title: 'Logo',
		component: Logo
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
	<Logo {...args} />
</Template>

<Story name="Default Logo" />
