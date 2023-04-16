<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import Button from './Button.svelte';
	import { fly } from 'svelte/transition';

	// Register service worker
	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
	};

	$: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
	<div class="toast" role="alert" in:fly>
		<div class="message">
			{#if $offlineReady}
				<span> App ready to work offline </span>
			{:else}
				<span> New content available, click reload to update. </span>
			{/if}
		</div>
		<footer class="toast-footer">
			{#if $needRefresh}
				<Button size="small" variant="primary" on:click={() => updateServiceWorker(true)}>
					Reload
				</Button>
			{/if}
			<Button size="small" on:click={close}>Close</Button>
		</footer>
	</div>
{/if}

<style>
	.toast,
	.toast-footer {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.toast {
		position: sticky;
		bottom: 0;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 1rem;
		background: var(--gray-light);
	}
</style>
