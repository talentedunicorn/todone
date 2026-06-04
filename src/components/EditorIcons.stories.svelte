<script module lang="ts">
	import IconH2 from './IconH2.svelte';
	import IconH3 from './IconH3.svelte';
	import IconImage from './IconImage.svelte';
	import IconTable from './IconTable.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'EditorIcons',
		tags: ['!autodocs']
	});
</script>

<Story name="Custom icons" description="Custom icons for the editor">
	<div
		style="display: flex; gap: 1rem; align-items: center; padding: 0.5rem; background: var(--white); color: var(--black); border-radius: 0.5rem; width: fit-content;"
	>
		<IconH2 />
		<IconH3 />
		<IconImage />
		<IconTable />
	</div>
</Story>
