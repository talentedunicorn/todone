<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from './Button.svelte';
	import { toastActions, toastMessage } from '../stores';

	let dialog: HTMLDialogElement;

	const close = () => {
		dialog.close();
		toastMessage.set(null);
		toastActions.set(null);
	};

	$effect(() => {
		if ($toastMessage) {
			dialog?.show();
		}
	});
</script>

<dialog bind:this={dialog}>
	{#if $toastMessage}
		<section class="wrapper" in:fly={{ y: 20 }}>
			{$toastMessage}
			<footer class="toast-footer">
				{#if $toastActions}
					{#each $toastActions as action}
						<Button size="small" onclick={action.callback}>{action.label}</Button>
					{/each}
				{/if}
				<Button size="small" onclick={close}>Close</Button>
			</footer>
		</section>
	{/if}
</dialog>

<style>
	dialog {
		position: fixed;
		bottom: 0;
		border: none;
		background: none;
	}

	.wrapper,
	footer {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.wrapper {
		border-radius: 1rem;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 1rem;
		background: var(--gray-light);
	}
</style>
