<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { toastActions, toastMessage } from '../stores';

	// Register service worker
	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
		toastMessage.set(null);
		toastActions.set(null);
	};

	$: {
		if ($offlineReady) {
			toastMessage.set('App ready to work offline.');
		}

		if ($needRefresh) {
			toastMessage.set('New content available, click reload to update.');
			toastActions.set([
				{
					label: 'Reload',
					callback: () => {
						updateServiceWorker(true);
						close();
					}
				}
			]);
		}
	}
</script>
