<script lang="ts">
	import Button from './Button.svelte';
	import todosStore from '../stores/todos';

	const { exportData, importData } = todosStore;

	let importField: HTMLInputElement;
	let files = $state<FileList>();

	let processing = $state(false);

	$effect(() => {
		if (files?.length ?? 0 > 0) {
			importData(files!);
		}
	});
</script>

<form method="post">
	<input
		type="file"
		accept=".json"
		hidden
		name="import"
		id="import"
		bind:this={importField}
		bind:files
	/>
	<Button type="button" size="large" onclick={() => importField.click()} disabled={processing}
		>Import</Button
	>
</form>
<Button size="large" onclick={exportData} disabled={processing}>Export</Button>
