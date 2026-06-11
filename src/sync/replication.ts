import type { RxDatabase } from 'rxdb';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { SyncStatus, status } from '../stores/sync';
import type { Todo } from '../domain/todo';

export const setupReplication = (
	db: RxDatabase,
	url: string,
	getAuthToken: () => Promise<string | null>,
	onTokenExpired?: () => Promise<string | null>
) => {
	let retried = false;
	let refreshing = false;

	const fetchWithAuth = async (
		url: RequestInfo | URL,
		options?: RequestInit
	): Promise<Response> => {
		const headers = new Headers(options?.headers);
		const authToken = await getAuthToken();
		if (authToken) {
			headers.set('Authorization', `Bearer ${authToken}`);
		}

		const response = await fetch(url, {
			...options,
			headers
		});

		if (!response.ok) {
			let reason = 'Sync request failed';
			try {
				const body = await response.clone().json();
				reason = body.reason || reason;
			} catch {
				reason = response.statusText || reason;
			}

			const isAuthError = response.status === 401;
			if (isAuthError && onTokenExpired && !refreshing && !retried) {
				refreshing = true;
				retried = true;
				const newToken = await onTokenExpired();
				refreshing = false;
				if (newToken) {
					try {
						const retryResponse = await fetchWithAuth(url, options);
						if (retryResponse.ok) {
							retried = false;
							return retryResponse;
						}
						reason = 'Sync request failed with refreshed token';
					} catch {
						reason = 'Sync request failed with refreshed token';
					}
				}
				retried = false;
			}

			throw new Error(reason);
		}

		// Reset retry flag on success
		retried = false;

		return response;
	};

	const replicationState = replicateCouchDB<Todo>({
		replicationIdentifier: 'couchdb-replication',
		collection: db.todos,
		live: true,
		url,
		fetch: fetchWithAuth,
		pull: {
			batchSize: 500
		},
		push: {
			batchSize: 500
		}
	});

	replicationState.active$.subscribe(() => status.set(SyncStatus.ACTIVE));
	replicationState.error$.subscribe(() => {
		status.set(SyncStatus.ERROR);
	});

	return replicationState;
};
