import PouchDB from 'pouchdb-browser';
import { status, SyncStatus } from './stores';

export type Todo = any;

const db = new PouchDB(import.meta.env.VITE_DB_NAME || 'ToDone');

const add = async ({ title, value }: { title: string; value: string }) => {
	await db.put({
		_id: new Date().toISOString(),
		title,
		value,
		completed: false,
		updated: new Date()
	});
};

const update = async (todo: Todo) => {
	await db.put({ ...todo, updated: new Date() });
};

const remove = async (id: string, rev: string) => {
	await db.remove(id, rev);
};

const getTodos = async () => {
	const todos = (await db.allDocs({ include_docs: true, descending: true })).rows.map(
		(t) => t.doc
	) as Todo[];
	return todos;
};

const onChangeHandler = (callback: () => void) => {
	if (import.meta.env.VITE_SYNCED === 'true') {
		// Sync with remote
		db.sync(import.meta.env.VITE_REMOTE_DB, {
			live: true,
			retry: true
		})
			.on('active', () => {
				status.set(SyncStatus.ACTIVE);
			})
			.on('paused', () => {
				if (!navigator.onLine) {
					status.set(SyncStatus.ERROR);
				}
			});
	}

	db.changes({
		since: 'now',
		live: true
	}).on('change', callback);
};

export { getTodos, add, update, remove, onChangeHandler };
