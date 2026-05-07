import type { RxDatabase } from 'rxdb';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { SyncStatus, status } from '../stores/sync';
import type { Todo } from '../domain/todo';

export const setupReplication = (
	db: RxDatabase,
	url: string,
	getAuthToken: () => string | null
) => {
	const authGetter = getAuthToken;

	const fetchWithAuth = async (url: RequestInfo | URL, options?: RequestInit) => {
		const headers = new Headers(options?.headers);
		const authToken = authGetter();
		headers.set('Authorization', `Bearer ${authToken}`);

		const response = await fetch(url, {
			...options,
			headers
		});

		if (!response.ok) {
			const { error, reason }: { error: string; reason: string } = await response.json();
			if (reason === 'exp not in future') {
				throw new Error('Token expired');
			}
		}

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
