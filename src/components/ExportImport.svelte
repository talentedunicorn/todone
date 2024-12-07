<script lang="ts">
	import Button from './Button.svelte';
	import { exportTodos, importTodos, type Todo } from '../db';
	import { toastMessage } from '../stores';
	import { z } from 'zod';

	let importField: HTMLInputElement;
	let importForm: HTMLFormElement;
	let files = $state<FileList>();

	let processing = $state(false);

	const exportData = async () => {
		processing = true;
		try {
			const data = (await exportTodos()).map((t: Todo) => ({
				id: t?.id,
				title: t?.title,
				value: t?.value,
				completed: t?.completed,
				updated: t?.updated
			}));

			if (data.length < 1) throw Error('No tasks found in the database.');

			const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
			const name = `ToDone_${new Date().toISOString()}.json`;
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = name;

			document.body.appendChild(link);

			link.click();

			document.body.removeChild(link);
			toastMessage.set('Data exported successfully.');
		} catch (e: any) {
			toastMessage.set(e.message);
		} finally {
			processing = false;
		}
	};

	const importData = async () => {
		const file = files?.[0];
		const data = JSON.parse((await file?.text()) ?? '');
		const schema = z.array(
			z.object({
				id: z.string(),
				title: z.string(),
				value: z.string(),
				completed: z.boolean(),
				updated: z.coerce.date()
			})
		);

		const result = schema.safeParse(data);
		if (result.success) {
			try {
				await importTodos(data);
				toastMessage.set('Imported data successfully');
			} catch (e) {
				toastMessage.set('Failed to import data');
			}
		} else {
			toastMessage.set('Invalid file selected. Please select an exported file');
			importForm.reset();
		}
	};

	$effect(() => {
		if (files?.length ?? 0 > 0) {
			importData();
		}
	});
</script>

<form method="post" bind:this={importForm}>
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
