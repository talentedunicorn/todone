<script module lang="ts">
	import ExportImport from './ExportImport.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'ExportImport',
		component: ExportImport
	});
</script>

{#snippet template()}
	<ExportImport />
{/snippet}

<Story
	name="Default"
	{template}
	play={async ({ canvas }) => {
		expect(canvas.getByText('Import')).toBeInTheDocument();
		expect(canvas.getByText('Export')).toBeInTheDocument();
	}}
/>
