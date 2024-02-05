import PouchDB from 'pouchdb-browser';
import { status, SyncStatus } from './stores';

export type Todo = {
	_id: string;
	_rev: string;
	title: string;
	value: string;
	completed: boolean;
	updated: Date;
};

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
	const todos = (await db.allDocs({ include_docs: true, descending: true })).rows.map((t) => t.doc);
	return todos as PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta & Todo>[];
};

const bulkInsert = async (todos: Todo[]) => {
	await db.bulkDocs<Todo>(todos);
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

export { getTodos, bulkInsert, add, update, remove, onChangeHandler };
