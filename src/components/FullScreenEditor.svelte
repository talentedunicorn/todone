<script lang="ts">
	import { tick } from 'svelte';
	import Dialog from './Dialog.svelte';
	import Form from './Form.svelte';
	import type { Todo } from '../domain/todo';

	interface Props {
		open: boolean;
		defaultValue?: Todo | null;
		onClose: () => void;
		onSave: (data: Todo) => Promise<void> | void;
		onDelete?: (data: Todo) => Promise<void> | void;
	}

	let { open, defaultValue = null, onClose, onSave, onDelete }: Props = $props();

	const isEdit = $derived(defaultValue !== null);

	let dialogOpen = $state(false);

	const handleClose = () => {
		dialogOpen = false;
		onClose();
	};

	const handleSave = async (data: Todo) => {
		await onSave(data);
		handleClose();
	};

	$effect(() => {
		if (open && !dialogOpen) {
			dialogOpen = true;
			// Focus the title input after dialog renders
			void tick().then(() => {
				document.getElementById('title')?.focus();
			});
		} else if (!open && dialogOpen) {
			dialogOpen = false;
		}
	});
</script>

<Dialog
	open={dialogOpen}
	label={isEdit ? defaultValue!.title : ''}
	maxWidth="56rem"
	onClose={handleClose}
>
	<Form
		{defaultValue}
		onSubmit={handleSave}
		onUpdate={handleSave}
		onClear={handleClose}
		enableEditor={true}
		{onDelete}
	/>
</Dialog>
