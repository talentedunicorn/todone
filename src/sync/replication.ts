import type { RxDatabase } from 'rxdb';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { SyncStatus, status } from '../stores/sync';
import { token } from '../stores/auth';
import type { Todo } from '../domain/todo';

export const setupReplication = (db: RxDatabase, url: string) => {
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
	replicationState.error$.subscribe((e) => {
		if (e.parameters?.errors?.at(0)?.message === 'Token expired') {
			token.set(null);
		}
		status.set(SyncStatus.ERROR);
	});

	return replicationState;
};

const fetchWithAuth = async (url: RequestInfo | URL, options?: RequestInit) => {
	let authToken: string | null | undefined;

	const headers = new Headers(options?.headers);

	token.subscribe((v) => (authToken = v));
	headers.set('Authorization', `Bearer ${authToken}`);

	const response = await fetch(url, {
		...options,
		headers
	});

	if (!response.ok) {
		const { error, reason }: { error: string; reason: string } = await response.json();
		if (reason === 'exp not in future') {
			token.set(null);
			throw new Error('Token expired');
		}
	}

	return response;
};
