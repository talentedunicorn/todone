<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
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

	let dialog: HTMLDialogElement | undefined = $state();

	const isEdit = $derived(defaultValue !== null);

	const handleClose = () => {
		dialog?.close();
		onClose();
	};

	const handleSave = async (data: Todo) => {
		await onSave(data);
		handleClose();
	};

	$effect(() => {
		if (open && dialog && !dialog.open) {
			dialog.showModal();
			// Focus the title input after dialog opens
			void tick().then(() => {
				document.getElementById('title')?.focus();
			});
		} else if (!open && dialog?.open) {
			dialog.close();
		}
	});
</script>

{#if open}
	<dialog
		bind:this={dialog}
		class="fullscreen-dialog"
		onclick={(e) => {
			if (e.target === dialog) handleClose();
		}}
		onclose={handleClose}
		transition:fade={{ duration: 200 }}
	>
		<div class="dialog-content" transition:fly={{ y: 30, duration: 250 }}>
			<div class="dialog-header">
				<h2 class="dialog-title">{isEdit ? defaultValue!.title : ''}</h2>
				<button class="close-btn" onclick={handleClose} aria-label="Close">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
			<Form
				{defaultValue}
				onSubmit={handleSave}
				onUpdate={handleSave}
				onClear={handleClose}
				enableEditor={true}
				{onDelete}
			/>
		</div>
	</dialog>
{/if}

<style>
	.fullscreen-dialog {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		max-width: 100vw;
		max-height: 100dvh;
		border: none;
		background: rgba(0, 0, 0, 0.4);
		padding: 0;
		overflow: hidden;
	}

	.fullscreen-dialog::backdrop {
		background: rgba(0, 0, 0, 0.4);
	}

	.dialog-content {
		display: flex;
		flex-direction: column;
		width: 90%;
		max-width: 56rem;
		max-height: 90dvh;
		margin: 2rem auto;
		background: var(--white, #ffffff);
		border-radius: 1rem;
		box-shadow:
			0 25px 50px rgba(0, 0, 0, 0.25),
			0 8px 16px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		position: relative;
		top: 5dvh;
		padding: 1rem;
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0 1rem 0;
		flex-shrink: 0;
	}

	.dialog-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--black);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
		min-width: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		color: var(--black);
		transition:
			background 0.15s,
			color 0.15s;
	}

	.close-btn:hover {
		background: var(--gray-light);
		color: var(--black);
	}

	@media (max-width: 640px) {
		.dialog-content {
			width: 100%;
			max-width: 100%;
			max-height: 100dvh;
			margin: 0;
			border-radius: 0;
			top: 0;
			height: 100dvh;
			overflow-y: auto;
		}
	}
</style>
