<script lang="ts" context="module">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import Logo from './Logo.svelte';

	export const meta = {
		title: 'Logo',
		component: Logo
	};
</script>

<Template let:args>
	<Logo {...args} />
</Template>

<Story name="Default Logo" />
