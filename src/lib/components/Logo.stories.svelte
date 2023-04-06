<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Logo from './Logo.svelte';
</script>

<Meta title="Logo" component={Logo} />

<Template let:args>
	<Logo {...args} />
</Template>

<Story name="Default Logo" />
