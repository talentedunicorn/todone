<script module lang="ts">
	import ToggleTheme from './ToggleTheme.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'ToggleTheme'
	});
</script>

<Story name="Default">
	<ToggleTheme />
</Story>
