import type { RxDatabase } from 'rxdb';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { SyncStatus, status } from '../stores/sync';
import type { Todo } from '../domain/todo';

export const setupReplication = (
	db: RxDatabase,
	url: string,
	getAuthToken: () => string | null,
	onTokenExpired?: () => Promise<string | null>
) => {
	let retried = false;

	const fetchWithAuth = async (url: RequestInfo | URL, options?: RequestInit) => {
		const headers = new Headers(options?.headers);
		const authToken = getAuthToken();
		if (authToken) {
			headers.set('Authorization', `Bearer ${authToken}`);
		}

		const response = await fetch(url, {
			...options,
			headers
		});

		if (!response.ok) {
			// Try to parse the error body — CouchDB may return non-JSON for 401
			let reason = 'Sync request failed';
			try {
				const body = await response.clone().json();
				reason = body.reason || reason;
			} catch {
				// Non-JSON response (e.g. HTML from a proxy), use status text
				reason = response.statusText || reason;
			}

			const isAuthError = response.status === 401;
			if (isAuthError && onTokenExpired && !retried) {
				retried = true;
				const newToken = await onTokenExpired();
				if (newToken) {
					headers.set('Authorization', `Bearer ${newToken}`);
					const retryResponse = await fetch(url, { ...options, headers });
					if (retryResponse.ok) {
						retried = false;
						return retryResponse;
					}
					// Retry also failed, fall through to throw
				} else {
					// Refresh returned null — token definitely expired, stop retrying
				}
			}

			// Don't leak the token in error logs
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
