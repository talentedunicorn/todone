<script lang="ts">
	import { type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import IconX from './IconX.svelte';

	interface Props {
		open: boolean;
		label: string;
		onClose: () => void;
		children: Snippet;
		maxWidth?: string;
	}

	let { open, label, onClose, children, maxWidth = '36rem' }: Props = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	const handleClose = () => {
		dialog?.close();
		onClose();
	};

	$effect(() => {
		if (open && dialog && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog?.open) {
			dialog.close();
		}
	});
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<dialog
		bind:this={dialog}
		class="dialog-overlay"
		onclick={(e) => {
			if (e.target === dialog) handleClose();
		}}
		onclose={handleClose}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="dialog-content"
			style="--max-width: {maxWidth}"
			transition:fly={{ y: 30, duration: 250 }}
		>
			<div class="dialog-header">
				<h2 class="dialog-title">{label}</h2>
				<button class="close-btn" onclick={handleClose} aria-label="Close">
					<IconX />
				</button>
			</div>
			{@render children()}
		</div>
	</dialog>
{/if}

<style>
	.dialog-overlay {
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
		overscroll-behaviour: contain;
	}

	.dialog-overlay::backdrop {
		background: rgba(0, 0, 0, 0.4);
	}

	.dialog-content {
		display: flex;
		flex-direction: column;
		width: 90%;
		max-width: var(--max-width, 36rem);
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
