<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from './Button.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		message: string | null;
		footer?: Snippet;
		close: () => void;
	}

	let { message, footer, close }: Props = $props();
	let dialog: HTMLDialogElement;

	const dialogClose = () => {
		dialog.close();
		close();
	};

	$effect(() => {
		if (message) {
			dialog?.show();
		}
	});
</script>

<dialog bind:this={dialog}>
	{#if message}
		<section class="wrapper" in:fly={{ y: 20 }}>
			{message}
			<footer class="toast-footer">
				{#if footer}{@render footer()}{/if}
				<!-- {#if $toastActions} -->
				<!-- 	{#each $toastActions as action} -->
				<!-- 		<Button size="small" onclick={action.callback}>{action.label}</Button> -->
				<!-- 	{/each} -->
				<!-- {/if} -->
				<Button size="small" onclick={dialogClose}>Close</Button>
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
		z-index: 2;

		.wrapper {
			border-radius: 1rem;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 1rem;
			background: var(--gray-light);

			&,
			& footer {
				display: flex;
				align-items: center;
				gap: 1rem;
			}
		}
	}
</style>
