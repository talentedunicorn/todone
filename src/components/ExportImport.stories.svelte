<script module lang="ts">
	import ExportImport from './ExportImport.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'ExportImport'
	});
</script>

<Story name="Default">
	<ExportImport />
</Story>
