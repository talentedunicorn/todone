<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import toastStore from '../stores/toast';

	const { setMessage, clearMessage } = toastStore;

	// Register service worker
	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
		clearMessage();
	};

	$effect(() => {
		if ($offlineReady) {
			setMessage('App ready to work offline.');
		}

		if ($needRefresh) {
			setMessage('New content available, click reload to update.', [
				{
					label: 'Reload',
					callback: () => {
						updateServiceWorker(true);
						close();
					}
				}
			]);
		}
	});
</script>
