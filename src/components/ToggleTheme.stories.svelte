<script module lang="ts">
	import ToggleTheme from './ToggleTheme.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'ToggleTheme'
	});
</script>

<Story name="Default">
	<div
		style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid var(--gray-light); border-radius: 0.5rem; width: fit-content;"
	>
		<ToggleTheme />
		<span style="font-size: 0.85rem; color: var(--gray);"
			>Click to cycle: system → dark → light</span
		>
	</div>
</Story>
