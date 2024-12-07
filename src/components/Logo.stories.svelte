<script module>
	import Logo from './Logo.svelte';

	export const meta = {
		title: 'Logo',
		component: Logo
	};
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template>
	{#snippet children({ args })}
		<Logo {...args} />
	{/snippet}
</Template>

<Story name="Default Logo" />
