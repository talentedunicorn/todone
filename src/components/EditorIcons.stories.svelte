<script module lang="ts">
	import IconH2 from './IconH2.svelte';
	import IconH3 from './IconH3.svelte';
	import IconImage from './IconImage.svelte';
	import IconTable from './IconTable.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'EditorIcons'
	});
</script>

<Story name="Gallery">
	<div
		style="display: flex; gap: 1rem; align-items: center; padding: 0.5rem; background: #f5f5f5; border-radius: 0.5rem; width: fit-content;"
	>
		<span style="font-size: 0.8rem; font-weight: 600; color: #666; padding: 0 0.5rem;">H2</span>
		<IconH2 />
		<span style="font-size: 0.8rem; font-weight: 600; color: #666; padding: 0 0.5rem;">H3</span>
		<IconH3 />
		<span style="font-size: 0.8rem; font-weight: 600; color: #666; padding: 0 0.5rem;">Image</span>
		<IconImage />
		<span style="font-size: 0.8rem; font-weight: 600; color: #666; padding: 0 0.5rem;">Table</span>
		<IconTable />
	</div>
</Story>
